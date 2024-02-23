import type { Plugin } from 'onerepo';
import * as cmd from './commands/jest';

/**
 * Options for configuring the Jest oneRepo plugin.
 *
 * ```js title="onerepo.config.js"
 * export default {
 * 	plugins: [
 * 		jest({
 * 			// optional configuration
 * 		}),
 * 	],
 * });
 * ```
 *
 * @default `{}`
 */
export type Options = {
	/**
	 * Specify the main Jest configuration file, if different from `<repo>/jest.config.js`. This can be relative to the repository root.
	 *
	 * ```js title="onerepo.config.js"
	 * export default {
	 * 	plugins: [
	 * 		jest({
	 * 			config: 'configs/jest.config.js'
	 * 		}),
	 * 	],
	 * });
	 * ```
	 */
	config?: string;
	/**
	 * @default `'jest'`
	 * Rename the default command name. This configuration is recommended, but not provided, to avoid potential conflicts with other commands.
	 *
	 * ```js title="onerepo.config.js"
	 * export default {
	 * 	plugins: [
	 * 		jest({
	 * 			name: ['test', 'jest']
	 * 		}),
	 * 	],
	 * });
	 * ```
	 */
	name?: string | Array<string>;
	/**
	 * @default `true`
	 * Automatically include Jests's flag `--passWithNoTests` when running.
	 *
	 * ```js title="onerepo.config.js"
	 * export default {
	 * 	plugins: [
	 * 		jest({
	 * 			passWithNoTests: false,
	 * 		}),
	 * 	],
	 * });
	 * ```
	 */
	passWithNoTests?: boolean;
};

/**
 * Include the `jest` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { jest } from '@onerepo/plugin-jest';
 *
 * export default {
 * 	plugins: [jest()],
 * };
 * ```
 */
export function jest(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			if (process.env.ONEREPO_DOCGEN) {
				for (const key of Object.keys(opts)) {
					opts[key as keyof Options] = undefined;
				}
			}

			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options...]`);
					if (opts.config) {
						y.default('config', opts.config);
					}
					y.default('passWithNoTests', opts.passWithNoTests ?? true);
					return y;
				},
				handler,
			);
		},
	};
}
