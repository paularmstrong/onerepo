import type { PluginObject } from '@onerepo/core';
import * as cmd from './commands/vitest';

/**
 * @example
 *
 * ```js
 * setup({
 * 	plugins: [
 * 		vitest({
 * 			name: ['test']
 * 		}),
 * 	],
 * });
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
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { vitest } from '@onerepo/plugin-vitest';
 *
 * setup({
 * 	plugins: [vitest()],
 * }).then(({ run }) => run());
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
