import { minimatch } from 'minimatch';
import type { Builder, Handler, RunSpec } from '@onerepo/cli';
import type { Repository, Task, Workspace } from '@onerepo/graph';
import { batch, git, logger, run } from '@onerepo/cli';

export const command = 'tasks';

export const description = 'Run tasks';

type Argv = {
	lifecycle: string;
	list?: boolean;
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
		});

export const handler: Handler<Argv> = async (argv, { graph }) => {
	const { lifecycle, list } = argv;

	/**
	 * Calculate change delta (files)
	 * Get affected workspaces & tasks
	 * Get tasks matching globs across non-directly-affected workspaces
	 *   -> eg, Have seen apps/docs want to run the `one docgen` task, but not depend on *every* workspace
	 *
	 * Running tasks:
	 *  1. Batch parallelizable tasks
	 *  2. Run non-parallel tasks individually
	 *
	 * Listing tasks (--list)
	 *  --list --format=json
	 *  --list --format=??
	 */

	const { all: files } = await git.getModifiedFiles();

	const sequentialTasks: Array<RunSpec> = [];
	const parallelTasks: Array<RunSpec> = [];

	for (const workspace of Object.values(graph.workspaces)) {
		logger.log(`Looking for tasks in ${workspace.name}`);
		if (lifecycle in workspace.tasks) {
			const { parallel, sequential } = workspace.getTasks(lifecycle);

			sequential.forEach((task) => {
				const spec = taskToSpec(graph, workspace, files, task);
				if (spec) {
					sequentialTasks.push(spec);
				}
			});

			parallel.forEach((task) => {
				const spec = taskToSpec(graph, workspace, files, task);
				if (spec) {
					parallelTasks.push(spec);
				}
			});
		}
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

function taskToSpec(graph: Repository, workspace: Workspace, files: Array<string>, task: Task): RunSpec | null {
	const command = typeof task === 'string' ? task : task.cmd;
	const [cmd, ...args] = command.split(' ');

	if (typeof task !== 'string') {
		const match = files.find((file) => {
			return minimatch(file, task.match);
		});
		if (!match) {
			return null;
		}
		logger.debug(`Including \`${command}\` because \`${task.match}\` was satisfied by \`${match}\``);
	}

	const bin = cmd === '$0' ? process.argv[1] : cmd;

	return {
		name: `Run \`${command.replace(/^\$0/, bin.split('/')[bin.split('/').length - 1])}\` in \`${workspace.name}\``,
		cmd: cmd === '$0' ? graph.root.relative(process.argv[1]) : cmd,
		args,
		opts: {
			cwd: graph.root.relative(workspace.location) || '.',
		},
	};
}
