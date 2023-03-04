import type { Yargs } from '@onerepo/types';

/**
 * Adds the following input arguments to command [handler](#handler). Typically used in conjunction with getters like [`getAffected`](#getaffected), [`getFiles`](#getfiles), and [`getWorkspaces`](#getworkspaces).
 * - `--affected`
 * - `--from-ref`
 * - `--through-ref`
 *
 * If all of `--all`, `--files`, and `--workspaces` were not passed, `--affected` will default to `true`.
 *
 * See [`WithAffected`](#withaffected-1) for type safety.
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withAffected(yargs);
 * ```
 *
 * @category Builder
 */
export const withAffected = <T>(yargs: Yargs<T>): Yargs<T & WithAffected> =>
	yargs
		.option('affected', {
			type: 'boolean',
			description: 'Select all affected workspaces. If no other inputs are chosen, this will default to `true`.',
			conflicts: ['all'],
		})
		.option('from-ref', {
			type: 'string',
			description: 'Git ref to start looking for affected files or workspaces',
			conflicts: ['all'],
			hidden: true,
		})
		.option('through-ref', {
			type: 'string',
			description: 'Git ref to start looking for affected files or workspaces',
			conflicts: ['all'],
			hidden: true,
		})
		.middleware((argv) => {
			if (!('all' in argv || 'files' in argv || 'workspaces' in argv)) {
				// @ts-ignore
				argv.affected = typeof argv.affected === 'boolean' ? argv.affected : true;
			}
		});

/**
 * To be paired with the [`withAffected()` builder](#withaffected). Adds types for arguments parsed.
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithAffected & {
 *   // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withAffected(yargs);
 * ```
 *
 * @category Builder
 */
export type WithAffected = {
	/**
	 * When used with builder helpers, will include all of the affected workspaces based on changes within the repository.
	 */
	affected?: boolean;
	/**
	 * Git ref to calculate changes _exclusively_ _since_.
	 */
	'from-ref'?: string;
	/**
	 * Git ref to calculate changes _inclusively_ _through_.
	 */
	'through-ref'?: string;
};
