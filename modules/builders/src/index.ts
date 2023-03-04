/**
 * Builders and Getters work together as reusable ways to add optional command-line arguments that affect how workspaces and files are retrived.
 *
 * Note that while `builders` are available, `getters` should typically be referenced from the extra arguments passed to your `handler` function:
 *
 * ```ts
 * import { builders } from 'onerepo';
 *
 * export const name = 'mycommand';
 *
 * export const builder: Builder = (yargs) => builders.withWorkspaces(yargs);
 *
 * export const handler: Handler = async (argv, { getWorkspaces, logger }) => {
 *  const workspaces = await getWorkspaces();
 *
 *  logger.log(workspaces.map(({ name }) => name));
 * };
 * ```
 *
 * ```sh
 * $ one mycommand --workspaces ws-1 ws-2
 * ['ws-1', 'ws-2']
 * ```
 *
 * @module
 */
export * as getters from './getters';
export * as builders from './builders';
