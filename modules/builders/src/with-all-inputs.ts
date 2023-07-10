import type { DefaultArgv, Yargs } from '@onerepo/yargs';
import { withAffected } from './with-affected';
import { withFiles } from './with-files';
import { withWorkspaces } from './with-workspaces';
import type { WithAffected } from './with-affected';
import type { WithFiles } from './with-files';
import type { WithWorkspaces } from './with-workspaces';

/**
 * Helper to chain all of {@link !builders.withAffected | `builders.withAffected`}, {@link !builders.withFiles | `builders.withFiles`}, and {@link !builders.withWorkspaces | `builders.withWorkspaces`} on a {@link !Builder | `Builder`}.
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
 * Helper to include all of {@link !builders.withAffected | `builders.withAffected`}, {@link !builders.withFiles | `builders.withFiles`}, and {@link !builders.withWorkspaces | `builders.withWorkspaces`} on builder {@link !Argv | `Argv`}.
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
