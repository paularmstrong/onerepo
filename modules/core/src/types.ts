import type { RequireDirectoryOptions } from 'yargs';
import type { Argv, DefaultArgv, Yargs } from '@onerepo/yargs';
import type { Options as DocgenOptions } from './core/docgen';
import type { Options as GenerateOptions } from './core/generate';
import type { Options as GraphOptions } from './core/graph';
import type { Options as InstallOptions } from './core/install';
import type { Options as TasksOptions } from './core/tasks';

/**
 * @group Core
 */
export type { DocgenOptions, GenerateOptions, GraphOptions, InstallOptions, TasksOptions };

/**
 * @group Core
 */
export type CoreConfig = {
	/**
	 * Configuration options fopr the [Docgen](/docs/core/docgen/) core module.
	 */
	docgen?: DocgenOptions | false;
	/**
	 * Configuration options fopr the [Generate](/docs/core/generate/) core module.
	 */
	generate?: GenerateOptions | false;
	/**
	 * Configuration options fopr the [Graph](/docs/core/graph/) core module.
	 */
	graph?: GraphOptions | false;
	/**
	 * Configuration options fopr the [Install](/docs/core/install/) core module.
	 */
	install?: InstallOptions | false;
	/**
	 * Configuration options fopr the [Tasks](/docs/core/tasks/) core module.
	 */
	tasks?: TasksOptions | false;
};

/**
 * Setup configuration for the oneRepo command-line interface.
 * @group Core
 */
export type Config = {
	/**
	 * Core plugin configuration. These plugins will be added automatically unless the value specified is `false`
	 * @default `{}`
	 */
	core?: CoreConfig;
	/**
	 * When you ask for `--help` at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…
	 */
	description?: string;
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
	 * Give your CLI a unique name that's short and easy to remember.
	 * If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?
	 * @default `'one'`
	 */
	name?: string;
	/**
	 * Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/docs/plugins/) for more information.
	 * @default `[]`
	 */
	plugins?: Array<Plugin>;
	/**
	 * Absolute path location to the root of the repository.
	 * @default `process.cwd()`
	 */
	root?: string;
	/**
	 * A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.
	 * @default `'commands'`
	 */
	subcommandDir?: string | false;
};

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
export type Plugin = PluginObject | ((config: Config) => PluginObject);
