import createYargs from 'yargs/yargs';
import initJiti from 'jiti';
import type { Logger } from '@onerepo/logger';
import { bufferSubLogger, getLogger } from '@onerepo/logger';
import type { Graph } from '@onerepo/graph';
import { setup } from '../../setup/setup';
import type { Lifecycle } from '../../types';
import { tasks } from '.';

/**
 * Run Lifecycle tasks in commands other than the `one tasks` command. Use this function when you have a command triggering a Lifecycle in non-standard ways.
 *
 * ```ts
 * await runTasks('pre-publish', ['-w', 'my-workspace'], graph);
 * ```
 * @alpha
 * @group Subprocess
 * @param lifecycle The individual Lifecycle to trigger.
 * @param args Array of string arguments as if passed in from the command-line.
 * @param graph The current repository {@link Graph}.
 * @param logger Optional {@link Logger} instance. Defaults to the current `Logger` (usually there is only one).
 */
export async function runTasks(lifecycle: Lifecycle, args: Array<string>, graph: Graph, logger: Logger = getLogger()) {
	const jiti = initJiti(graph.root.location, { interopDefault: true });

	const step = logger.createStep(`Run ${lifecycle} tasks`, { writePrefixes: false });
	const subLogger = bufferSubLogger(step);
	const { yargs: postYargs } = await setup({
		require: jiti,
		root: graph.root.location,
		config: graph.root.config,
		yargs: createYargs(['tasks', '--lifecycle', lifecycle, ...args], graph.root.location, jiti),
		corePlugins: [tasks],
		logger: subLogger.logger,
	});
	await postYargs.parse();
	await subLogger.end();
	await step.end();
}
