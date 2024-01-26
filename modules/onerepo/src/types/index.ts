import type { RootConfig } from './config-root';
import type { WorkspaceConfig } from './config-workspace';

/**
 * Picks the correct config type between `RootConfig` and `WorkspaceConfig` based on whether the `root` property is set. Use this to help ensure your configs do not have any incorrect keys or values.
 *
 * Satisfy a `RootConfig`:
 *
 * ```ts
 * import type { Config } from 'onerepo';
 *
 * export default {
 *  root: true,
 * } satisfies Config;
 * ```
 *
 * Satisfy a `WorkspaceConfig` with custom lifecycles on tasks:
 *
 * ```ts
 * import type { Config } from 'onerepo';
 *
 * export default {
 *  tasks: {
 *    stage: {
 *      serial: ['$0 build'],
 *    }
 *  },
 * } satisfies Config<'stage'>;
 * ```
 * @group Config
 */
export type Config<CustomLifecycles extends string | void = void> =
	| RootConfig<CustomLifecycles>
	| WorkspaceConfig<CustomLifecycles>;

export * from './plugin';
export * from './config-root';
export * from './config-workspace';
export * from './tasks';
