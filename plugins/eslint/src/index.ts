import type { Plugin } from 'onerepo';
import * as cmd from './commands/eslint';

/**
 * @example
 *
 * ```js title="onerepo.config.js"
 * export default {
 * 	plugins: [
 * 		eslint({
 * 			extensions: ['ts', 'tsx', 'astro', 'js', 'cjs', 'mjs']
 * 		}),
 * 	],
 * };
 * ```
 */
export type Options = {
	/**
	 * List of file extensions (without the `.`) that ESLint should operate across.
	 */
	extensions?: Array<string>;
	/**
	 * The name of the eslint command. You might change this to `'lint'` or `['lint', 'eslint']` to keep things more familiar for most developers.
	 */
	name?: string | Array<string>;
	/**
	 * Control the ESLint setting default to suppress warnings and only report errors.
	 */
	quiet?: boolean;
	/**
	 * When `true` or unset and run in GitHub Actions, any files failing format checks will be annotated with an error in the GitHub user interface.
	 */
	githubAnnotate?: boolean;
};

/**
 * Include the `eslint` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { eslint } from '@onerepo/plugin-eslint';
 *
 * export default {
 * 	plugins: [eslint()],
 * };
 * ```
 */
export function eslint(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => {
					const y = builder(yargs)
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`)
						.default('github-annotate', opts.githubAnnotate ?? true);
					if (opts.extensions) {
						y.default('extensions', opts.extensions);
					}
					if (opts.quiet) {
						y.default('quiet', opts.quiet);
					}
					return y;
				},
				handler,
			);
		},
	};
}
