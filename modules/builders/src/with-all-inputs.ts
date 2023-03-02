import type { DefaultArgv, Yargs } from '@onerepo/types';
import type { WithAffected } from './with-affected';
import { withAffected } from './with-affected';
import type { WithFiles } from './with-files';
import { withFiles } from './with-files';
import type { WithWorkspaces } from './with-workspaces';
import { withWorkspaces } from './with-workspaces';

/**
 * Helper to chain all of [`withAffected`](#withaffected), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces) on a [`Builder`](#builder).
 *
 * ```js
 * export const builder = (yargs) => withAllInputs(yargs);
 * ```
 */
export const withAllInputs = (yargs: Yargs<DefaultArgv>): Yargs<WithAllInputs> =>
	withAffected(withFiles(withWorkspaces(yargs)));

/**
 * Helper to include all of [`WithAffected`](#withaffected-1), [`WithFiles`](#withfiles-1), and [`WithWorkspaces`](#withworkspaces-1) on builder [`Argv`](#argv).
 *
 * ```ts
 * type Argv = WithAllInputs & {
 *  // ...
 * };
 *
 * export const builder: Builder<Argv> = (yargs) => withAllInputs(yargs);
 * ```
 */
export type WithAllInputs = WithAffected & WithFiles & WithWorkspaces;
