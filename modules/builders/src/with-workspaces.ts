import type { Yargs } from '@onerepo/types';

/**
 * Adds the following input arguments to command [handler](#handler). Typically used in conjunction with getters like [`getAffected`](#getaffected) [`getWorkspaces`](#getworkspaces).
 * - `--all`
 * - `--workspaces`
 *
 * See [`WithWorkspaces`](#withworkspaces-1) for type safety.
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withWorkspaces(yargs);
 * ```
 *
 * @category Builder
 */
export const withWorkspaces = <T>(yargs: Yargs<T>): Yargs<T & WithWorkspaces> =>
	yargs
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Run across all workspaces',
			conflicts: ['affected', 'workspaces'],
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of workspace names to run against',
			conflicts: ['all'],
		});

/**
 * To be paired with the [`withWorkspaces()` builder](#withworkspaces). Adds types for arguments parsed.
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithWorkspaces & {
 *   // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withWorkspaces(yargs);
 * ```
 *
 * @category Builder
 */
export type WithWorkspaces = {
	/**
	 * Include _all_ workspaces.
	 */
	all?: boolean;
	/**
	 * One or more workspaces by `name` or `alias` string.
	 */
	workspaces?: Array<string>;
};
