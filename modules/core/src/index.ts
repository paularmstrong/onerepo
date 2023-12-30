import createYargs from 'yargs/yargs';
import { setup as internalSetup } from './setup';
import type { Config } from './types';
import { generate } from './core/generate';
import { graph } from './core/graph';
import { install } from './core/install';
import { tasks } from './core/tasks';

export type { GraphSchemaValidators } from './core/graph';
export type { App } from './setup';
export * from './types';

export async function setup(config: Config) {
	return await internalSetup(config, createYargs(process.argv.slice(2)), corePlugins);
}

export const corePlugins = {
	generate,
	graph,
	install,
	tasks,
};

/**
 * @internal
 */
export { internalSetup };
