import type { Yargs } from '@onerepo/yargs';

/**
 * Adds the following input arguments to command {@link Handler | `Handler`}. Typically used in conjunction with getters like {@link getAffected | `builders.getAffected`} {@link getWorkspaces | `builders.getWorkspaces`}.
 * - `--all`
 * - `--workspaces`
 *
 * See {@link WithWorkspaces | `builders.WithWorkspaces`} for type safety.
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withWorkspaces(yargs);
 * ```
 *
 * @group Builders
 */
export const withWorkspaces = <T>(yargs: Yargs<T>): Yargs<T & WithWorkspaces> =>
	yargs
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Run across all Workspaces',
			conflicts: ['affected', 'workspaces'],
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of Workspace names to run against',
			conflicts: ['all'],
		});

/**
 * To be paired with the {@link withWorkspaces | `builders.withWorkspaces`}. Adds types for arguments parsed.
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithWorkspaces & {
 *   // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withWorkspaces(yargs);
 * ```
 *
 * @group Builders
 */
export type WithWorkspaces = {
	/**
	 * Include _all_ Workspaces.
	 */
	all?: boolean;
	/**
	 * One or more Workspaces by `name` or `alias` string.
	 */
	workspaces?: Array<string>;
};
