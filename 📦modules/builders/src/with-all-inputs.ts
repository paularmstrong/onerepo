import type { DefaultArgv, Yargs } from '@onerepo/yargs';
import { withAffected } from './with-affected';
import { withFiles } from './with-files';
import { withWorkspaces } from './with-workspaces';
import type { WithAffected } from './with-affected';
import type { WithFiles } from './with-files';
import type { WithWorkspaces } from './with-workspaces';

/**
 * Helper to chain all of [`withAffected`](#withaffected), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces) on a [`Builder`](#builder).
 *
 * ```js title="commands/mycommand.js"
 * export const builder = (yargs) => builders.withAllInputs(yargs);
 * ```
 *
 * @group Builder
 */
export const withAllInputs = (yargs: Yargs<DefaultArgv>): Yargs<WithAllInputs> =>
	withAffected(withFiles(withWorkspaces(yargs)));

/**
 * Helper to include all of [`WithAffected`](#withaffected-1), [`WithFiles`](#withfiles-1), and [`WithWorkspaces`](#withworkspaces-1) on builder [`Argv`](#argv).
 *
 * ```ts title="commands/mycommand.ts"
 * type Argv = builders.WithAllInputs & {
 *  // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => builders.withAllInputs(yargs);
 * ```
 *
 * @group Builder
 */
export type WithAllInputs = WithAffected & WithFiles & WithWorkspaces;
