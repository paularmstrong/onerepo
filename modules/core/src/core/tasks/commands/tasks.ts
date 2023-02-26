import path from 'node:path';
import minimatch from 'minimatch';
import type { Builder, Handler } from '@onerepo/types';
import type { Lifecycle, Repository, Task, Tasks, Workspace } from '@onerepo/graph';
import { batch, run } from '@onerepo/subprocess';
import type { RunSpec } from '@onerepo/subprocess';
import * as git from '@onerepo/git';
import { logger } from '@onerepo/logger';
import type { WithAffected, WithWorkspaces } from '@onerepo/builders';
import { withAffected, withWorkspaces } from '@onerepo/builders';

export const command = 'tasks';

export const description =
	'Run tasks against repo-defined lifecycles. This command will limit the tasks across the affected workspace set based on the current state of the repository.';

type Argv = {
	ignore: Array<string>;
	lifecycle: Lifecycle;
	list?: boolean;
} & WithWorkspaces &
	WithAffected;

export const lifecycles: Array<Lifecycle> = [
	'pre-commit',
	'commit',
	'post-commit',
	'pre-checkout',
	'checkout',
	'post-checkout',
	'pre-merge',
	'merge',
	'post-merge',
	'pre-build',
	'build',
	'post-build',
	'pre-deploy',
	'deploy',
	'post-deploy',
	'pre-publish',
	'publish',
	'post-publish',
];

export const builder: Builder<Argv> = (yargs) =>
	withAffected(withWorkspaces(yargs))
		.usage(`$0 ${command} --lifecycle=<lifecycle> [options]`)
		.epilogue(
			'You can fine-tune the determination of affected workspaces by providing a `--from-ref` and/or `through-ref`. For more information, get help with `--help --show-advanced`.'
		)
		.option('lifecycle', {
			alias: 'c',
			description:
				'Task lifecycle to run. `pre-` and `post-` lifecycles will automatically be run for non-prefixed lifecycles.',
			demandOption: true,
			type: 'string',
			choices: lifecycles,
		})
		.option('list', {
			description: 'List found tasks. Implies dry run and will not actually run any tasks.',
			type: 'boolean',
		})
		.option('ignore', {
			description: 'List of filepath strings or globs to ignore when matching tasks to files.',
			type: 'array',
			string: true,
			default: [],
			hidden: true,
		});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph }) => {
	const { ignore, lifecycle, list, 'from-ref': fromRef, 'through-ref': throughRef } = argv;

	const requested = await getWorkspaces({ ignore });
	const affected = graph.affected(requested);
	const affectedNames = affected.map(({ name }) => name);
	const runAll = affected.includes(graph.root);
	if (runAll) {
		logger.warn('Running all tasks because the root is in the affected list.');
	} else {
		logger.debug(`Running\n • ${affected.map((ws) => ws.name).join('\n • ')}`);
	}

	const { added, modified, moved, deleted } = await git.getModifiedFiles(fromRef, throughRef);
	const allFiles = [...added, ...modified, ...moved, ...deleted];
	const files = allFiles.filter((file) => !ignore.some((ignore) => minimatch(file, ignore)));

	if (!files.length && !runAll && !affectedNames.length) {
		logger.warn('No tasks to run');
		if (list) {
			process.stdout.write('[]');
		}
		return;
	}

	const sequentialTasks: TaskSet = { pre: [], run: [], post: [] };
	const parallelTasks: TaskSet = { pre: [], run: [], post: [] };
	let hasTasks = false;

	function addTasks(force: (task: Task) => boolean, workspace: Workspace, tasks: Required<Tasks>, type: keyof TaskSet) {
		tasks.sequential.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const spec = taskToSpec(graph, workspace, task, affectedNames);
				sequentialTasks[type].push(spec);
			}
		});

		tasks.parallel.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const spec = taskToSpec(graph, workspace, task, affectedNames);
				parallelTasks[type].push(spec);
			}
		});
	}

	for (const workspace of graph.workspaces) {
		logger.log(`Looking for tasks in ${workspace.name}`);

		const isPre = lifecycle.startsWith('pre-');
		const isPost = lifecycle.startsWith('post-');

		const force = (task: Task) =>
			runAll || (typeof task === 'string' && workspace.isRoot) || affected.includes(workspace);

		if (isPre || !isPost) {
			const tasks = workspace.getTasks(isPre ? lifecycle : `pre-${lifecycle}`);
			addTasks(force, workspace, tasks, 'pre');
		}

		if (!isPre && !isPost) {
			const tasks = workspace.getTasks(lifecycle);
			addTasks(force, workspace, tasks, 'run');
		}

		if (isPost || !isPre) {
			const tasks = workspace.getTasks(isPost ? lifecycle : `post-${lifecycle}`);
			addTasks(force, workspace, tasks, 'post');
		}
	}

	if (list) {
		const all = [
			...parallelTasks.pre,
			...sequentialTasks.pre,
			...parallelTasks.run,
			...sequentialTasks.run,
			...parallelTasks.post,
			...sequentialTasks.post,
		];
		logger.debug(JSON.stringify(all, null, 2));
		process.stdout.write(JSON.stringify(all));
		return;
	}

	if (!hasTasks) {
		logger.warn(`No tasks to run`);
		return;
	}

	try {
		await batch(parallelTasks.pre);
		await batch(parallelTasks.run);
		await batch(parallelTasks.post);
	} catch (e) {
		// continue so all tasks run
	}

	for (const task of sequentialTasks.pre) {
		try {
			await run(task);
		} catch (e) {
			// continue so all tasks run
		}
	}
	for (const task of sequentialTasks.run) {
		try {
			await run(task);
		} catch (e) {
			// continue so all tasks run
		}
	}
	for (const task of sequentialTasks.post) {
		try {
			await run(task);
		} catch (e) {
			// continue so all tasks run
		}
	}

	// Command will fail if any subprocesses failed
};

function taskToSpec(graph: Repository, workspace: Workspace, task: Task, wsNames: Array<string>): ExtendedRunSpec {
	const command = typeof task === 'string' ? task : task.cmd;
	const meta = typeof task !== 'string' ? task.meta ?? {} : {};
	const [cmd, ...args] = command.replace('${workspaces}', wsNames.join(' ')).split(' ');

	const bin = cmd === '$0' ? process.argv[1] : cmd;
	const passthrough = [
		process.env.ONE_REPO_DRY_RUN === 'true' ? '--dry-run' : false,
		'',
		cmd === '$0' && logger.verbosity ? `-${'v'.repeat(logger.verbosity)}` : '',
	].filter(Boolean) as Array<string>;

	return {
		name: `Run \`${command.replace(/^\$0/, bin.split('/')[bin.split('/').length - 1])}\` in \`${workspace.name}\``,
		cmd: cmd === '$0' ? workspace.relative(process.argv[1]) : cmd,
		args: [...args, ...passthrough],
		opts: { cwd: graph.root.relative(workspace.location) || '.' },
		meta: {
			...meta,
			name: workspace.name,
			slug: slugify(workspace.name),
		},
	};
}

function matchTask(force: boolean, task: Task, files: Array<string>, cwd: string) {
	if (typeof task === 'string' || !task.match) {
		return force;
	}

	return minimatch.match(files, path.join(cwd, task.match)).length > 0;
}

function slugify(str: string) {
	return str.replace(/\W+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

type ExtendedRunSpec = RunSpec & { meta: { name: string; slug: string } };
type TaskSet = { pre: Array<ExtendedRunSpec>; run: Array<ExtendedRunSpec>; post: Array<ExtendedRunSpec> };
