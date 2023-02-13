import { minimatch } from 'minimatch';
import type { Builder, Handler } from '@onerepo/cli';
import type { Repository, Task, Workspace } from '@onerepo/graph';
import { batch, run } from '@onerepo/subprocess';
import type { RunSpec } from '@onerepo/subprocess';
import * as git from '@onerepo/git';
import { logger } from '@onerepo/logger';

export const command = 'tasks';

export const description = 'Run tasks';

type Argv = {
	ignore: Array<string>;
	lifecycle: string;
	list?: boolean;
	'from-ref'?: string;
	'through-ref'?: string;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.option('lifecycle', {
			alias: 'c',
			description: 'Task lifecycle to run',
			demandOption: true,
			type: 'string',
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
		})
		.option('from-ref', {
			type: 'string',
			description: 'Git ref to start looking for affected files or workspaces',
			hidden: true,
		})
		.option('through-ref', {
			type: 'string',
			description: 'Git ref to start looking for affected files or workspaces',
			hidden: true,
		});

export const handler: Handler<Argv> = async (argv, { getAffected, graph }) => {
	const { ignore, lifecycle, list, 'from-ref': fromRef, 'through-ref': throughRef } = argv;

	const affected = await getAffected({ from: fromRef, through: throughRef });
	const runAll = affected.includes(graph.root);
	logger.warn('Running all tasks because the root is in the affected list.');

	const { all: allFiles } = await git.getModifiedFiles();
	const files = allFiles.filter((file) => ignore.some((ignore) => !minimatch(file, ignore)));

	const sequentialTasks: Array<RunSpec> = [];
	const parallelTasks: Array<RunSpec> = [];

	for (const workspace of Object.values(graph.workspaces)) {
		logger.log(`Looking for tasks in ${workspace.name}`);
		const { parallel, sequential } = workspace.getTasks(lifecycle);

		const force = (task: Task) =>
			runAll || (typeof task === 'string' && workspace.isRoot) || affected.includes(workspace);

		sequential.forEach((task) => {
			const match = force(task) || matchTask(task, files);
			if (match) {
				const spec = taskToSpec(graph, workspace, task);
				sequentialTasks.push(spec);
			}
		});

		parallel.forEach((task) => {
			const match = force(task) || matchTask(task, files);
			if (match) {
				const spec = taskToSpec(graph, workspace, task);
				parallelTasks.push(spec);
			}
		});
	}

	if (list) {
		const all = [...parallelTasks, ...sequentialTasks];
		logger.debug(JSON.stringify(all, null, 2));
		process.stdout.write(JSON.stringify(all));
		return;
	}

	if (!parallelTasks.length && !sequentialTasks.length) {
		logger.log(`No tasks to run`);
		return;
	}

	try {
		await batch(parallelTasks);
	} catch (e) {
		// continue so all tasks run
	}

	for (const task of sequentialTasks) {
		try {
			await run(task);
		} catch (e) {
			// continue so all tasks run
		}
	}

	// Command will fail if any subprocesses failed
};

function taskToSpec(graph: Repository, workspace: Workspace, task: Task): RunSpec {
	const command = typeof task === 'string' ? task : task.cmd;
	const [cmd, ...args] = command.split(' ');

	const bin = cmd === '$0' ? process.argv[1] : cmd;
	const passthrough = [
		process.env.ONE_REPO_DRY_RUN === 'true' ? '--dry-run' : false,
		'',
		logger.verbosity ? `-${'v'.repeat(logger.verbosity)}` : '',
	].filter(Boolean) as Array<string>;

	return {
		name: `Run \`${command.replace(/^\$0/, bin.split('/')[bin.split('/').length - 1])}\` in \`${workspace.name}\``,
		cmd: cmd === '$0' ? workspace.relative(process.argv[1]) : cmd,
		args: [...args, ...passthrough],
		opts: {
			cwd: graph.root.relative(workspace.location) || '.',
		},
	};
}

function matchTask(task: Task, files: Array<string>) {
	if (typeof task === 'string') {
		return false;
	}

	return minimatch.match(files, task.match);
}
