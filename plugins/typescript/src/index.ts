import type { Plugin } from 'onerepo';
import * as cmd from './commands/typescript';

/**
 * Options for configuring the TypeScript plugin for oneRepo.
 *
 * ```js title="onerepo.config.js"
 * export default {
 * 	plugins: [
 * 		typescript({
 * 			tsconfig: 'tsconfig.base.json'
 * 		}),
 * 	],
 * };
 * ```
 */
export type Options = {
	/**
	 * The name of the typescript command.
	 */
	name?: string;
	/**
	 * Use [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html). Setting to `true` will automatically sync dependency project references to your tsconfig. Defaults to `false`.
	 */
	useProjectReferences?: boolean;
	/**
	 * Use a different filename than the default `tsconfig.json` for type checking by default. This can always be overridden by passing `--tsconfig=<filename>` as an argument to the command.
	 */
	tsconfig?: string;
};

/**
 * Include the `typescript` plugin in your oneRepo plugin setup:
 *
 *
 * ```js title="onerepo.config.ts" {1,4}
 * import { typescript } from '@onerepo/plugin-typescript';
 *
 * export default {
 * 	plugins: [typescript()],
 * };
 * ```
 */
export function typescript(opts: Options = {}): Plugin {
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
					if (opts.tsconfig) {
						y.default('tsconfig', opts.tsconfig);
					}
					if ('useProjectReferences' in opts) {
						y.default('use-project-references', opts.useProjectReferences);
					}
					return y;
				},
				handler,
			);
		},
	};
}
