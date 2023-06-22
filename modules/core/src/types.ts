import type { RequireDirectoryOptions } from 'yargs';
import type { Argv, DefaultArgv, HandlerExtra, Yargs } from '@onerepo/yargs';
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
	 */
	core?: CoreConfig;
	/**
	 * What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.
	 */
	head?: string;
	/**
	 * When using subcommandDir, include a regular expression here to ignore files. By default, we will try to override *.(test|spec).* files and maybe some more. This will override the default.
	 */
	ignoreCommands?: RegExp;
	/**
	 * When you ask for `--help` at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…
	 */
	description?: string;
	/**
	 * Give your CLI a unique name that's short and easy to remember.
	 * If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?
	 */
	name?: string;
	/**
	 * Add shared commands. https://onerepo.tools/docs/plugins/
	 */
	plugins?: Array<Plugin>;
	/**
	 * Absolute path location to the root of the repository.
	 */
	root?: string;
	/**
	 * A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.
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
	 * Run before any command `handler` function is invoked
	 */
	preHandler?: (argv: Argv<DefaultArgv>, extra: HandlerExtra) => Promise<void> | void;
	/**
	 * Run after any command `handler` function is finished
	 */
	postHandler?: (argv: Argv<DefaultArgv>, extra: HandlerExtra) => Promise<void> | void;
};

/**
 * @group Core
 */
export type Plugin = PluginObject | ((config: Config) => PluginObject);
