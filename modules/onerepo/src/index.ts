/**
 *
 * ```sh
 * npm install --save onerepo
 * ```
 *
 * ```sh
 * yarn add onerepo
 * ```
 *
 * ## Writing oneRepo commands
 *
 * Commands all have 4 minimum requirements to be exported:
 *
 * | Export | Type | Description | Required |
 * | --- | --- | --- | --- |
 * | `name` | `string \| Array<string>` | The command’s name. If provided as an array, all values will be considered aliases for the same command.<br><br>Any value can also be `'$0'`, which is a special token that allows this command to be the default for the parent. | ✅ |
 * | `description` | `string \| false` | A help description. If set to `false`, the command will be hidden from help documentation when not using `--help --show-advanced` | ✅ |
 * | `builder` | {@link Builder | `Builder<T>`} | A function that helps parse the command-line arguments | ✅ |
 * | `handler` | {@link Handler | `Handler<T>`} | Asynchronous function that is invoked for the command | ✅ |
 *
 *
 * ```ts title="./commands/basic.ts"
 * import type { Builder, Handler } from 'onerepo';
 *
 * export const name = 'basic';
 *
 * export const description = 'A basic command that shows the minimum requirements for writing commands with oneRepo';
 *
 * export const builder: Builder = (yargs) => yargs.usage(`$0 ${name}`);
 *
 * export const handler: Handler = (argv, { logger }) => {
 * 	logger.warn('Nothing to do!');
 * };
 * ```
 *
 * ### Common use-cases
 *
 * oneRepo exports helpers in the form of {@link builders} for common input arguments and {@link getters} for file and workspace querying based on the `builders`’ input arguments.
 *
 * ```ts
 * export const builder: Builder<WithWorkspaces> = (yargs) => builders.withWorkspaces(yargs);
 *
 * export const handler: Handler<WithWorkspaces> = (argv, { getWorkspaces }) => {
 *  // Get a list of workspaces given the input arguments
 *  const workspaces = getWorkspaces();
 * };
 * ```
 *
 * Using the previous command, we can then get the list of _affected_ workspaces based on the input workspace `some-workspace` using common inputs:
 *
 * ```sh
 * one my-command --workspace some-workspace --affected
 * ```
 *
 * For a full list of available helpers on handlers, see {@link HandlerExtra}.
 *
 * ### Helpful documentation
 *
 * The more explanation and context that you can provide, the better it will be for your peers using commands. Consider adding [epilogues](http://yargs.js.org/docs/#api-reference-epiloguestr) and [examples](http://yargs.js.org/docs/#api-reference-examplecmd-desc) along with the required `description`.
 *
 * You can also generate Markdown documentation of the full CLI using [@onerepo/plugin-docgen](/docs/plugins/docgen/)!
 *
 * @module
 */

export * from '@onerepo/core';
export * from '@onerepo/logger';

export * as graph from '@onerepo/graph';
export * as git from '@onerepo/git';
/**
 * ```ts
 * import { file } from 'onerepo';
 * ```
 */
export * as file from '@onerepo/file';

/**
 * ```ts
 * import { builders } from 'onerepo';
 * ```
 */
export { builders, getters } from '@onerepo/builders';

export * from '@onerepo/subprocess';
export * from '@onerepo/yargs';
