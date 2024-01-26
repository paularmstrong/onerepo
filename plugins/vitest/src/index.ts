import type { PluginObject } from 'onerepo';
import * as cmd from './commands/vitest';

/**
 *
 * ```js
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
	config?: string;
	/**
	 * The name of the vitest command. You might change this to `'test'` or `['test', 'vitest']` to keep things more familiar for most developers.
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
