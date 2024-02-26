import type { Yargs } from '@onerepo/yargs';

/**
 * Adds the following input arguments to command {@link !Handler | `Handler`}. Typically used in conjunction with getters like {@link !builders.getAffected | `builders.getAffected`}, {@link !builders.getFilepaths | `builders.getFilepaths`}, and {@link !builders.getWorkspaces | `builders.getGetWorkspaces`}.
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
 * @group Builders
 */
export const withAffected = <T>(yargs: Yargs<T>): Yargs<T & WithAffected> =>
	yargs
		.option('affected', {
			type: 'boolean',
			description: 'Select all affected Workspaces. If no other inputs are chosen, this will default to `true`.',
			conflicts: ['all'],
		})
		.option('from-ref', {
			type: 'string',
			description: 'Git ref to start looking for affected files or workspaces',
			conflicts: ['all'],
			hidden: true,
		})
		.option('staged', {
			type: 'boolean',
			description:
				'Use files on the git stage to calculate affected files or Workspaces. When unset or `--no-staged`, changes will be calculated from the entire branch, since its fork point.',
			conflicts: ['all', 'from-ref', 'through-ref'],
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
 * To be paired with the {@link withAffected | `builders.withAffected`}. Adds types for arguments parsed.
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithAffected & {
 *   // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withAffected(yargs);
 * ```
 *
 * @group Builders
 */
export type WithAffected = {
	/**
	 * When used with builder helpers, will include all of the affected Workspaces based on changes within the repository.
	 */
	affected?: boolean;
	/**
	 * Git ref to calculate changes _exclusively_ _since_.
	 */
	'from-ref'?: string;
	/**
	 * Calculate changes based _inclusively_ on the files added to the git stage.
	 */
	staged?: boolean;
	/**
	 * Git ref to calculate changes _inclusively_ _through_.
	 */
	'through-ref'?: string;
};
