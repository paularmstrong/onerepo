import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/prettier';

/**
 * @example
 *
 * ```js
 * setup({
 * 	plugins: [
 * 		prettier({
 * 			name: ['format', 'prettier']
 * 		}),
 * 	],
 * });
 * ```
 */
export type Options = {
	name?: string | Array<string>;
};

/**
 * Include the `prettier` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { prettier } from '@onerepo/plugin-prettier';
 *
 * setup({
 * 	plugins: [prettier()],
 * }).then(({ run }) => run());
 * ```
 */
export function prettier(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`),
				handler
			);
		},
	};
}
