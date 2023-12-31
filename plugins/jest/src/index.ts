import type { Plugin } from 'onerepo';
import * as cmd from './commands/jest';

/**
 * @example
 *
 * ```js
 * setup({
 * 	plugins: [
 * 		jest({
 * 			name: ['test', 'jest']
 * 		}),
 * 	],
 * });
 * ```
 */
export type Options = {
	/**
	 * Specify the main Jest configuration file, if different from `<repo>/jest.config.js`. This can be relative to the repository root.
	 * @example
	 * ```js
	 * jest({
	 * 	config: 'configs/jest/config.js'
	 * });
	 * ```
	 */
	config?: string;
	/**
	 * Rename the default command name.
	 */
	name?: string | Array<string>;
};

/**
 * Include the `jest` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { jest } from '@onerepo/plugin-jest';
 *
 * setup({
 * 	plugins: [jest()],
 * }).then(({ run }) => run());
 * ```
 */
export function jest(opts: Options = {}): Plugin {
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
