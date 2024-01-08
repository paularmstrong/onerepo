import type { RequireDirectoryOptions } from 'yargs';
import type { Argv, DefaultArgv, Yargs } from '@onerepo/yargs';
import type { TaskConfig, WorkspaceConfig } from '@onerepo/graph';
import type { Options as GenerateOptions, generate as GeneratePlugin } from './core/generate';
import type { Options as GraphOptions, graph as GraphPlugin } from './core/graph';
import type { Options as TasksOptions, tasks as TasksPlugin } from './core/tasks';
import type { Options as CodeownersOptions, codeowners as CodeownersPlugin } from './core/codeowners';

/**
 * @group Core
 */
export type { CodeownersOptions, GenerateOptions, GraphOptions, TasksOptions };

/**
 * @experimental
 * @group Core
 */
export type CoreConfig = {
	/**
	 * Configuration options fopr the [Codeowners](/docs/core/codeowners/) core module.
	 */
	codeowners?: CodeownersOptions;
	/**
	 * Configuration options fopr the [Generate](/docs/core/generate/) core module.
	 */
	generate?: GenerateOptions;
	/**
	 * Configuration options fopr the [Graph](/docs/core/graph/) core module.
	 */
	graph?: GraphOptions;
	/**
	 * Configuration options fopr the [Tasks](/docs/core/tasks/) core module.
	 */
	tasks?: TasksOptions;
};

/**
 * Setup configuration for the oneRepo command-line interface.
 * @group Core
 */
export type RootConfig = Omit<WorkspaceConfig, 'root'> & {
	/**
	 * Core plugin configuration. These plugins will be added automatically unless the value specified is `false`
	 * @default `{}`
	 */
	core?: CoreConfig;
	/**
	 * What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.
	 * @default `'main'`
	 */
	head?: string;
	/**
	 * When using subcommandDir, include a regular expression here to ignore files.
	 * @default `/(\/__\w+__\/|\.test\.|\.spec\.|\.config\.)/`
	 */
	ignoreCommands?: RegExp;
	/**
	 * Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/docs/plugins/) for more information.
	 * @default `[]`
	 */
	plugins?: Array<Plugin>;
	/**
	 * Must be set to `true` in order to denote that this is the root of the repository.
	 */
	root: true;
	/**
	 * A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.
	 * @default `'commands'`
	 */
	subcommandDir?: string | false;
	/**
	 * Globally defined tasks per lifecycle
	 * @default `{}`
	 */
	tasks?: TaskConfig;
};

export type Config = RootConfig | WorkspaceConfig;

/**
 * @group Core
 */
export type PluginObject = {
	/**
	 * A function that is called with the CLI's `yargs` object and a visitor.
	 * It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the workspace graph, affected list, and much more.
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
	 *
	 * @example Reading the shutdown response object
	 * ```ts
	 * setup({ /* ... *\/ })
	 * 	.then(({ run }) => run())
	 * 	.then((shutdownResponse) => {
	 * 		console.log(shutdownResponse);
	 * 	});
	 * ```
	 */
	shutdown?: (argv: Argv<DefaultArgv>) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
};

/**
 * @group Core
 */
export type Plugin = PluginObject | ((config: Required<RootConfig>) => PluginObject);

/**
 * @internal
 */
export type CorePlugins = {
	codeowners?: typeof CodeownersPlugin;
	generate?: typeof GeneratePlugin;
	graph?: typeof GraphPlugin;
	tasks?: typeof TasksPlugin;
};
