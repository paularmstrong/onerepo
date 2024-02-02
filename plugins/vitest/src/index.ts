import type { PluginObject } from 'onerepo';
import * as cmd from './commands/vitest';

/**
 * Options for configuring the Vitest oneRepo plugin.
 *
 * ```js title="onerepo.config.js"
 * export default {
 * 	plugins: [
 * 		vitest({
 * 			name: ['test']
 * 		}),
 * 	],
 * };
 * ```
 */
export type Options = {
	/**
	 * Specify the main Jest configuration file, if different from `<repo>/vitest.config.js`. This can be relative to the repository root.
	 *
	 * ```js title="onerepo.config.js"
	 * export default {
	 * 	plugins: [
	 * 		vitest({
	 * 			config: 'configs/vitest.config.js'
	 * 		}),
	 * 	],
	 * });
	 * ```
	 */
	config?: string;
	/**
	 * @default `'vitest'`
	 * Rename the default command name. This configuration is recommended, but not provided, to avoid potential conflicts with other commands.
	 *
	 * ```js title="onerepo.config.js"
	 * export default {
	 * 	plugins: [
	 * 		vitest({
	 * 			name: ['test', 'vitest']
	 * 		}),
	 * 	],
	 * });
	 * ```
	 */
	name?: string | Array<string>;
};

/**
 * Include the `vitest` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { vitest } from '@onerepo/plugin-vitest';
 *
 * export default {
 * 	plugins: [vitest()],
 * };
 * ```
 */
export function vitest(opts: Options = {}): PluginObject {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if (opts.config) {
						y.default('config', opts.config);
					}
					return y;
				},
				handler,
			);
		},
	};
}
