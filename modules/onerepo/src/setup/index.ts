import { createRequire } from 'node:module';
import createYargs from 'yargs/yargs';
import type { Config, CorePlugins } from '../types';
import { changes } from '../core/changes/index.ts';
import { codeowners } from '../core/codeowners/index.ts';
import { create } from '../core/create/index.ts';
import { dependencies } from '../core/dependencies/index.ts';
import { generate } from '../core/generate/index.ts';
import { graph } from '../core/graph/index.ts';
import { hooks } from '../core/hooks/index.ts';
import { install } from '../core/install/index.ts';
import { tasks } from '../core/tasks/index.ts';
import { workspace } from '../core/workspace/index.ts';
import { defaultConfig, setup as internalSetup } from './setup.ts';

export type { GraphSchemaValidators } from '../core/graph/index.ts';
export type { App } from './setup.ts';

/**
 * @internal
 */
export async function setup(root: string, config: Config) {
	performance.mark('onerepo_start_Program');
	const require = createRequire(process.cwd());
	return await internalSetup({
		require,
		root,
		config,
		yargs: createYargs(process.argv.slice(2), process.cwd(), require),
		corePlugins,
	});
}

/**
 * @internal
 */
export { defaultConfig, internalSetup };

/**
 * @internal
 */
export const corePlugins: CorePlugins = [
	changes,
	codeowners,
	dependencies,
	generate,
	graph,
	hooks,
	install,
	tasks,
	workspace,
];

/**
 * @internal
 */
export const noRepoPlugins: CorePlugins = [create, install];
