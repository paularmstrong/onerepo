import path from 'node:path';
import { minimatch } from 'minimatch';
import initJiti from 'jiti';
import { batch, run } from '@onerepo/subprocess';
import * as git from '@onerepo/git';
import * as builders from '@onerepo/builders';
import type { PromiseFn, RunSpec } from '@onerepo/subprocess';
import type { Graph, Workspace } from '@onerepo/graph';
import type { Builder, Handler } from '@onerepo/yargs';
import { bufferSubLogger, getLogger } from '@onerepo/logger';
import type { Logger } from '@onerepo/logger';
import createYargs from 'yargs/yargs';
import { StagingWorkflow } from '@onerepo/git';
import { setup } from '../../setup/setup';
import type { Config, CorePlugins, Lifecycle, Task, TaskDef } from '../../types';
import { changes } from '../changes';
import { codeowners } from '../codeowners';
import { dependencies } from '../dependencies';
import { generate } from '../generate';
import { graph } from '../graph';
import { hooks } from '../hooks';
import { workspace } from '../workspace';

const corePlugins: CorePlugins = [changes, codeowners, dependencies, generate, graph, hooks, workspace];

export const command = 'tasks';

export const description =
	'Run tasks against repo-defined lifecycles. This command will limit the tasks across the affected Workspace set based on the current state of the repository.';

export type Argv = {
	ignore: Array<string>;
	lifecycle: Lifecycle;
	list?: boolean;
	shard?: string;
	'ignore-unstaged'?: boolean;
} & builders.WithWorkspaces &
	builders.WithAffected;

export const lifecycles: Array<Lifecycle> = [
	'pre-commit',
	'post-commit',
	'post-checkout',
	'pre-merge',
	'post-merge',
	'pre-push',
	'build',
	'pre-deploy',
	'pre-publish',
	'post-publish',
];

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.usage(`$0 ${command} --lifecycle=<lifecycle> [options...]`)
		.epilogue(
			'You can fine-tune the determination of affected Workspaces by providing a `--from-ref` and/or `through-ref`. For more information, get help with `--help --show-advanced`.',
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
		})
		.option('shard', {
			type: 'string',
			description: 'Shard the lifecycle across multiple instances. Format as `<shard-number>/<total-shards>`',
		})
		.example(
			'$0 --lifecycle=pre-merge --shard=1/5',
			'Shard all tasks for the `pre-merge` lifecycle into 5 groups and runs the first shard.',
		)
		.example(
			'$0 --lifecycle=pre-merge --shard=3/5',
			'Shard all tasks for the `pre-merge` lifecycle into 5 groups and runs the third shard.',
		)
		.option('ignore-unstaged', {
			description:
				'Force staged-changes mode on or off. If `true`, task determination and runners will ignore unstaged changes.',
			type: 'boolean',
		})
		.middleware(async (argv) => {
			const logger = getLogger();
			if ('shard' in argv && typeof argv.shard === 'string') {
				if (!/\d+\/\d+/.test(argv.shard)) {
					const msg = '--shard must be in the format <shard-num>/<total-shards>. Example: --shard=1/2';
					logger.error(msg);
					await logger.end();
					yargs.exit(1, new Error(msg));
				}
			}
		})
		.describe(
			'staged',
			'Backup unstaged files and use only those on the git stage to calculate affected files or Workspaces. Will re-apply the unstaged files upon exit.',
		);

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger, config }) => {
	const { affected, ignore, lifecycle, list, 'from-ref': fromRef, shard, staged, 'through-ref': throughRef } = argv;

	const stagingWorkflow = new StagingWorkflow({ graph, logger });
	if (staged) {
		await stagingWorkflow.saveUnstaged();
	}

	const setupStep = logger.createStep('Determining tasks');
	const requested = await getWorkspaces({ ignore, step: setupStep });

	const workspaces = affected ? graph.affected(requested) : requested;
	const workspaceNames = workspaces.map(({ name }) => name);

	const modifiedOpts = staged
		? { staged: true, step: setupStep }
		: { from: fromRef, through: throughRef, step: setupStep };
	const allFiles = await git.getModifiedFiles(modifiedOpts, { step: setupStep });
	const files = allFiles.filter((file) => !ignore.some((ignore) => minimatch(file, ignore)));

	if (!files.length && !workspaceNames.length) {
		setupStep.warn('No tasks to run');
		if (list) {
			process.stdout.write(JSON.stringify({ parallel: [], serial: [] }));
		}
		await setupStep.end();
		if (staged) {
			await stagingWorkflow.restoreUnstaged();
		}
		return;
	}

	let serialTasks: TaskList = [];
	let parallelTasks: TaskList = [];
	let hasTasks = false;

	for (const workspace of graph.workspaces) {
		setupStep.log(`Looking for tasks in ${workspace.name}`);

		const force = (task: Task) =>
			(workspace.isRoot && (typeof task === 'string' || Array.isArray(task))) || workspaces.includes(workspace);

		const tasks = workspace.getTasks(lifecycle);
		tasks.serial.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const specs = taskToSpecs(argv.$0, graph, workspace, task, workspaceNames, logger, config);
				serialTasks.push(specs);
			}
		});

		tasks.parallel.forEach((task) => {
			const shouldRun = matchTask(force(task), task, files, graph.root.relative(workspace.location));
			if (shouldRun) {
				hasTasks = true;
				const specs = taskToSpecs(argv.$0, graph, workspace, task, workspaceNames, logger, config);
				parallelTasks.push(specs);
			}
		});
	}

	if (shard) {
		const [shardNum, total] = shard.split('/').map((n) => parseInt(n, 10));
		serialTasks = shardTasks(serialTasks, shardNum, total);
		setupStep.debug(serialTasks);
		parallelTasks = shardTasks(parallelTasks, shardNum, total);
		setupStep.debug(parallelTasks);
	}

	if (list) {
		await setupStep.end();
		const step = logger.createStep('Listing tasks');
		const all = {
			parallel: parallelTasks,
			serial: serialTasks,
		};
		process.stdout.write(
			JSON.stringify(all, (key, value) => {
				// Filter out the alternative `fn` so we don't try to JSONify it
				if (value && !Array.isArray(value) && typeof value === 'object' && 'fn' in value) {
					const { fn, ...task } = value;
					return task;
				}
				return value;
			}),
		);
		await step.end();
		return;
	}

	if (!hasTasks) {
		setupStep.info(`No tasks to run`);
		await setupStep.end();
		if (staged) {
			await stagingWorkflow.restoreUnstaged();
		}
		return;
	}
	await setupStep.end();

	try {
		await batch(parallelTasks.flat(1).map((task) => task.fn ?? task));
	} catch {
		// continue so all tasks run
	}

	for (const task of serialTasks.flat(1).map((task) => task.fn ?? task)) {
		try {
			if (typeof task === 'function') {
				await task();
				continue;
			}
			await run(task);
		} catch {
			// continue so all tasks run
		}
	}

	if (staged) {
		await stagingWorkflow.restoreUnstaged();
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
	config: Config,
): Array<ExtendedRunSpec> {
	if (Array.isArray(task)) {
		return task.map((t) => singleTaskToSpec(cliName, graph, workspace, t, wsNames, logger, config));
	}

	if (typeof task !== 'string' && Array.isArray(task.cmd)) {
		return task.cmd.map((cmd) =>
			singleTaskToSpec(cliName, graph, workspace, { ...task, cmd }, wsNames, logger, config),
		);
	}

	return [
		singleTaskToSpec(cliName, graph, workspace, task as string | (TaskDef & { cmd: string }), wsNames, logger, config),
	];
}

const jiti = initJiti(process.cwd(), { interopDefault: true });

function singleTaskToSpec(
	cliName: string,
	graph: Graph,
	workspace: Workspace,
	task: string | (TaskDef & { cmd: string }),
	wsNames: Array<string>,
	logger: Logger,
	config: Config,
): ExtendedRunSpec {
	const command = typeof task === 'string' ? task : task.cmd;
	const meta = typeof task !== 'string' ? (task.meta ?? {}) : {};
	const [cmd, ...args] = command.replace('${workspaces}', wsNames.join(' ')).split(' ');

	const passthrough = [
		process.env.ONEREPO_DRY_RUN === 'true' ? '--dry-run' : false,
		'',
		cmd === '$0' && logger.verbosity ? `-${'v'.repeat(logger.verbosity)}` : '',
	].filter(Boolean) as Array<string>;

	const name = `${command.replace(/^\$0 /, `${cliName} `)} (${workspace.name})`;

	let fn: PromiseFn | undefined;
	if (cmd === '$0') {
		fn = async () => {
			const step = logger.createStep(name, { writePrefixes: false });
			const subLogger = bufferSubLogger(step);
			const { yargs } = await setup({
				require: jiti,
				root: graph.root.location,
				config,
				yargs: createYargs([...args, ...passthrough], undefined, jiti),
				corePlugins,
				logger: subLogger.logger,
			});
			await yargs.parse();
			await subLogger.end();

			await step.end();
			return ['', ''];
		};
	}

	return {
		name,
		cmd: cmd === '$0' ? workspace.relative(process.argv[1]) : cmd,
		args: [...args, ...passthrough],
		opts: { cwd: graph.root.relative(workspace.location) || '.' },
		meta: {
			...meta,
			name: workspace.name,
			slug: slugify(workspace.name),
		},
		fn,
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

type ExtendedRunSpec = RunSpec & { meta: { name: string; slug: string }; fn?: PromiseFn };
type TaskList = Array<Array<ExtendedRunSpec>>;

function shardTasks(tasks: TaskList, shard: number, totalShards: number) {
	if (!tasks.length) {
		return tasks;
	}
	const shardSize = Math.ceil(tasks.length / totalShards);
	let index = 0;
	let resIndex = 0;

	const result = new Array(Math.ceil(tasks.length / shardSize));

	while (index < tasks.length) {
		result[resIndex++] = tasks.slice(index, (index += shardSize));
	}
	return result[shard - 1];
}
