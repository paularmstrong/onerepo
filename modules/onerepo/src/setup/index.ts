import createYargs from 'yargs/yargs';
import initJiti from 'jiti';
import type { Config, CorePlugins } from '../types';
import { codeowners } from '../core/codeowners';
import { create } from '../core/create';
import { generate } from '../core/generate';
import { graph } from '../core/graph';
import { hooks } from '../core/hooks';
import { install } from '../core/install';
import { tasks } from '../core/tasks';
import { setup as internalSetup } from './setup';

export type { GraphSchemaValidators } from '../core/graph';
export type { App } from './setup';

/**
 * @internal
 */
export async function setup(root: string, config: Config) {
	performance.mark('onerepo_start_Program');
	const jiti = initJiti(process.cwd(), { interopDefault: true });
	return await internalSetup({
		require: jiti,
		root,
		config,
		yargs: createYargs(process.argv.slice(2), process.cwd(), jiti),
		corePlugins,
	});
}

/**
 * @internal
 */
export { internalSetup };

/**
 * @internal
 */
export const corePlugins: CorePlugins = [codeowners, generate, graph, hooks, tasks];

/**
 * @internal
 */
export const noRepoPlugins: CorePlugins = [create, install];
