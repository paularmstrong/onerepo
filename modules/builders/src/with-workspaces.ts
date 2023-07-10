import type { Yargs } from '@onerepo/yargs';

/**
 * Adds the following input arguments to command {@link Handler | `Handler`}. Typically used in conjunction with getters like {@link getAffected | `getters.affected`} {@link getWorkspaces | `getters.workspaces`}.
 * - `--all`
 * - `--workspaces`
 *
 * See {@link WithWorkspaces | `builders.WithWorkspaces`} for type safety.
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withWorkspaces(yargs);
 * ```
 *
 * @group Builder
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
 * @group Builder
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
