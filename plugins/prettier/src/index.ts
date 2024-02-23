import type { Plugin } from 'onerepo';
import * as cmd from './commands/prettier';

/**
 *
 * ```js title="onerepo.config.js"
 * export default {
 * 	plugins: [
 * 		prettier({
 * 			name: ['format', 'prettier']
 * 		}),
 * 	],
 * };
 * ```
 */
export type Options = {
	/**
	 * The name of the prettier command. You might change this to `'format'` or `['format', 'prettier']` to keep things more familiar for most developers.
	 */
	name?: string | Array<string>;
	/**
	 * When `true` or unset and run in GitHub Actions, any files failing format checks will be annotated with an error in the GitHub user interface.
	 * @default `true`
	 */
	githubAnnotate?: boolean;
	/**
	 * Whether to use Prettier's built-in cache determinism.
	 * @default `true`
	 */
	useCache?: boolean;
};

/**
 * Include the `prettier` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { prettier } from '@onerepo/plugin-prettier';
 *
 * export default {
 * 	plugins: [prettier()],
 * };
 * ```
 */
export function prettier(opts: Options = {}): Plugin {
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
				(yargs) =>
					builder(yargs)
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} [options...]`)
						.default('github-annotate', opts.githubAnnotate ?? true)
						.default('cache', opts.useCache ?? true),
				handler,
			);
		},
	};
}
