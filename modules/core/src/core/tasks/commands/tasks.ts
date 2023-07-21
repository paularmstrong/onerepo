import path from 'node:path';
import { minimatch } from 'minimatch';
import { batch, run } from '@onerepo/subprocess';
import * as git from '@onerepo/git';
import { builders } from '@onerepo/builders';
import type { RunSpec } from '@onerepo/subprocess';
import type { Graph, Lifecycle, Task, TaskDef, Workspace } from '@onerepo/graph';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Logger } from '@onerepo/logger';

export const command = 'tasks';

export const description =
	'Run tasks against repo-defined lifecycles. This command will limit the tasks across the affected workspace set based on the current state of the repository.';

type Argv = {
	ignore: Array<string>;
	lifecycle: Lifecycle;
	list?: boolean;
} & builders.WithWorkspaces &
	builders.WithAffected;

export const lifecycles: Array<Lifecycle> = [
	'pre-commit',
	'post-commit',
	'post-checkout',
	'pre-merge',
	'post-merge',
	'build',
	'deploy',
	'publish',
];

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command} --lifecycle=<lifecycle> [options]`)
		.epilogue(
			'You can fine-tune the determination of affected workspaces by providing a `--from-ref` and/or `through-ref`. For more information, get help with `--help --show-advanced`.',
		)
		.option('lifecycle', {
			alias: 'c',
			description:
				'Task lifecycle to run. All tasks for the given lifecycle will be run as merged parallel tasks, followed by the merged set of serial tasks.',
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

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { affected, ignore, lifecycle, list, 'from-ref': fromRef, staged, 'through-ref': throughRef } = argv;

	const requested = await getWorkspaces({ ignore });
	const workspaces = affected ? graph.affected(requested) : requested;
	const workspaceNames = workspaces.map(({ name }) => name);

	const modifiedOpts = staged ? { staged: true } : { from: fromRef, through: throughRef };
	const allFiles = await git.getModifiedFiles(modifiedOpts);
	const files = allFiles.filter((file) => !ignore.some((ignore) => minimatch(file, ignore)));

	if (!files.length && !workspaceNames.length) {
		logger.warn('No tasks to run');
		if (list) {
			process.stdout.write(JSON.stringify({ parallel: [], serial: [] }));
		}
		return;
	}

	const serialTasks: TaskList = [];
	const parallelTasks: TaskList = [];
	let hasTasks = false;

	for (const workspace of graph.workspaces) {
		logger.log(`Looking for tasks in ${workspace.name}`);

		const force = (task: Task) => (typeof task === 'string' && workspace.isRoot) || workspaces.includes(workspace);

		const tasks = workspace.getTasks(lifecycle);
		tasks.serial.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const specs = taskToSpecs(argv.$0, graph, workspace, task, workspaceNames, logger);
				serialTasks.push(specs);
			}
		});

		tasks.parallel.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const specs = taskToSpecs(argv.$0, graph, workspace, task, workspaceNames, logger);
				parallelTasks.push(specs);
			}
		});
	}

	if (list) {
		const all = {
			parallel: parallelTasks,
			serial: serialTasks,
		};
		logger.debug(JSON.stringify(all, null, 2));
		process.stdout.write(JSON.stringify(all));
		return;
	}

	if (!hasTasks) {
		logger.warn(`No tasks to run`);
		return;
	}

	try {
		await batch(parallelTasks.flat(1));
	} catch (e) {
		// continue so all tasks run
	}

	for (const task of serialTasks.flat(1)) {
		try {
			await run(task);
		} catch (e) {
			// continue so all tasks run
		}
	}

	// Command will fail if any subprocesses failed
};

function taskToSpecs(
	cliName: string,
	graph: Graph,
	workspace: Workspace,
	task: Task,
	wsNames: Array<string>,
	logger: Logger,
): Array<ExtendedRunSpec> {
	if (Array.isArray(task)) {
		return task.map((t) => singleTaskToSpec(cliName, graph, workspace, t, wsNames, logger));
	}

	if (typeof task !== 'string' && Array.isArray(task.cmd)) {
		return task.cmd.map((cmd) => singleTaskToSpec(cliName, graph, workspace, { ...task, cmd }, wsNames, logger));
	}

	return [singleTaskToSpec(cliName, graph, workspace, task as string | (TaskDef & { cmd: string }), wsNames, logger)];
}

function singleTaskToSpec(
	cliName: string,
	graph: Graph,
	workspace: Workspace,
	task: string | (TaskDef & { cmd: string }),
	wsNames: Array<string>,
	logger: Logger,
): ExtendedRunSpec {
	const command = typeof task === 'string' ? task : task.cmd;
	const meta = typeof task !== 'string' ? task.meta ?? {} : {};
	const [cmd, ...args] = command.replace('${workspaces}', wsNames.join(' ')).split(' ');

	const passthrough = [
		process.env.ONE_REPO_DRY_RUN === 'true' ? '--dry-run' : false,
		'',
		cmd === '$0' && logger.verbosity ? `-${'v'.repeat(logger.verbosity)}` : '',
	].filter(Boolean) as Array<string>;

	return {
		name: `${command.replace(/^\$0/, cliName)} (${workspace.name})`,
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
	if (typeof task === 'string' || Array.isArray(task) || !task.match) {
		return force;
	}

	return (Array.isArray(task.match) ? task.match : [task.match]).some(
		(match) => minimatch.match(files, path.join(cwd, match)).length > 0,
	);
}

function slugify(str: string) {
	return str.replace(/\W+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

type ExtendedRunSpec = RunSpec & { meta: { name: string; slug: string } };
type TaskList = Array<Array<ExtendedRunSpec>>;
