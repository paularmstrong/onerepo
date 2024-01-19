import type { RootConfig } from './config-root';
import type { WorkspaceConfig } from './config-workspace';

/**
 * @group Config
 */
export type Config = RootConfig | WorkspaceConfig;

export * from './plugin';
export * from './config-root';
export * from './config-workspace';
export * from './tasks';
