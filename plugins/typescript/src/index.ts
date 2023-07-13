import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/typescript';

/**
 * @example
 *
 * ```js
 * setup({
 * 	plugins: [
 * 		typescript({
 * 			tsconfig: 'tsconfig.base.json'
 * 		}),
 * 	],
 * });
 * ```
 */
export type Options = {
	/**
	 * The name of the typescript command.
	 */
	name?: string;
	/**
	 * Use a different filename thant he default `tsconfig.json` for type checking by default. This can always be overridden by passing `--tsconfig=<filename>` as an argument to the command.
	 */
	tsconfig?: string;
};

/**
 * Include the `typescript` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { typescript } from '@onerepo/plugin-typescript';
 *
 * setup({
 * 	plugins: [typescript()],
 * }).then(({ run }) => run());
 * ```
 */
export function typescript(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if (opts.tsconfig) {
						y.default('tsconfig', opts.tsconfig);
					}
					return y;
				},
				handler,
			);
		},
	};
}
