import type { RequireDirectoryOptions } from 'yargs';
import type { Argv, DefaultArgv, Yargs } from '@onerepo/yargs';
import type { Graph } from '@onerepo/graph';
import type { RootConfig } from './config-root';

/**
 * @group Plugins
 */

export type PluginObject = {
	/**
	 * A function that is called with the CLI's `yargs` object and a visitor.
	 * It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the Workspace Graph, affected list, and much more.
	 */
	yargs?: (yargs: Yargs, visitor: NonNullable<RequireDirectoryOptions['visit']>) => Yargs;
	/**
	 * Runs before any and all commands after argument parsing. This is similar to global Yargs middleware, but guaranteed to have the fully resolved and parsed arguments.
	 *
	 * Use this function for setting up global even listeners like `PerformanceObserver`, `process` events, etc.
	 */
	startup?: (argv: Argv<DefaultArgv>) => Promise<void> | void;
	/**
	 * Runs just before the application process is exited. Allows returning data that will be merged with all other shutdown handlers.
	 */
	shutdown?: (argv: Argv<DefaultArgv>) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
};

/**
 * @group Plugins
 */
export type Plugin = PluginObject | ((config: Required<RootConfig>, graph: Graph) => PluginObject);

/**
 * @internal
 */
export type CorePlugins = Array<Plugin>;
