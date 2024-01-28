import type { Yargs } from '@onerepo/yargs';

/**
 * Adds the following input arguments to command {@link Handler | `Handler`}. Typically used in conjunction with getters like {@link !builders.getFilepaths | `builders.getFilepaths`}.
 * - `--files`
 *
 * See [`WithFiles`](#withfiles-1) for type safety.
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withFiles(yargs);
 * ```
 *
 * @group Builder
 */
export const withFiles = <T>(yargs: Yargs<T>): Yargs<T & WithFiles> =>
	yargs.option('files', {
		alias: 'f',
		type: 'array',
		string: true,
		description: 'Determine Workspaces from specific files',
		conflicts: ['all', 'workspaces'],
	});

/**
 * To be paired with the {@link withFiles | `builders.withFiles`}. Adds types for arguments parsed.
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithFiles & {
 *   // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withFiles(yargs);
 * ```
 *
 * @group Builder
 */
export type WithFiles = {
	/**
	 * List of filepaths.
	 */
	files?: Array<string>;
};
