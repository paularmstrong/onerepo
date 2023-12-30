import createYargs from 'yargs/yargs';
import initJiti from 'jiti';
import { setup as internalSetup } from './setup';
import type { Config } from './types';
import { generate } from './core/generate';
import { graph } from './core/graph';
import { install } from './core/install';
import { tasks } from './core/tasks';

export type { GraphSchemaValidators } from './core/graph';
export type { App } from './setup';
export * from './types';

/**
 * @internal
 */
export async function setup(config: Config) {
	performance.mark('onerepo_start_Program');
	const jiti = initJiti(process.cwd(), { interopDefault: true });

	return await internalSetup(jiti, config, createYargs(process.argv.slice(2), process.cwd(), jiti), corePlugins);
}

/**
 * @internal
 */
export { internalSetup };

export const corePlugins = {
	generate,
	graph,
	install,
	tasks,
};
