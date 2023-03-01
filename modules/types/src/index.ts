declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			ONE_REPO_ROOT: string;
			ONE_REPO_DRY_RUN: string;
			ONE_REPO_VERBOSITY: string;
			ONE_REPO_HEAD_BRANCH: string;
		}
	}
}

import type { Argv as Yargv } from 'yargs';
import type { Logger, Step } from '@onerepo/logger';
import type { Repository, Workspace } from '@onerepo/graph';

/**
 * Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#builder) and [`Handler`](#handler).
 */
export type DefaultArgv = {
	/**
	 * Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.
	 *
	 * Also internally sets `process.env.ONE_REPO_DRY_RUN = 'true'`.
	 */
	'dry-run': boolean;
	/**
	 * Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.
	 */
	silent: boolean;
	/**
	 * Verbosity level for the Logger. See Logger.verbosity for more information.
	 */
	verbosity: number;
};

export type GetterOptions = {
	/**
	 * Git ref to calculate changes _exclusively_ _since_.
	 */
	from?: string;
	/**
	 * List of files to not take into account when getting the list of files, workspaces, and affected.
	 */
	ignore?: Array<string>;
	/**
	 * Git ref to calculate changes _inclusively_ _through_.
	 */
	through?: string;
	/**
	 * Optional logger step to avoid creating a new
	 */
	step?: Step;
};

export interface HandlerExtra {
	/**
	 * Get the affected workspaces based on the current state of the repository.
	 */
	getAffected: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * Get the affected filepaths based on the current inputs and state of the repository.
	 */
	getFilepaths: (opts?: GetterOptions) => Promise<Array<string>>;
	/**
	 * Get the affected workspaces based on the current inputs and the state of the repository.
	 * This function differs from `getAffected` in that it respects input arguments provided by
	 * `withWorkspaces`, `withFiles` and `withAffected`.
	 */
	getWorkspaces: (opts?: GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * The Repository Graph
	 */
	graph: Repository;
	/**
	 * Standard logger. This should _always_ be used in place of console.log unless you have
	 * a specific need to write to standard out differently.
	 */
	logger: Logger;
}

/**
 * Always present in Builder and Handler arguments.
 */
export interface DefaultArguments {
	/**
	 * Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.
	 */
	_: Array<string | number>;
	/**
	 * The script name or node command. Similar to `process.argv[1]`
	 */
	$0: string;
	/**
	 * Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate.
	 */
	'--': Array<string>;
}
// Reimplementation of this type from Yargs because we do not allow unknowns, nor camelCase
export type Arguments<T = object> = { [key in keyof T]: T[key] } & DefaultArguments;

/**
 * A [yargs object](http://yargs.js.org/docs/).
 */
export type Yargs<T = DefaultArgv> = Yargv<T>;

/**
 * Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.
 */
export type Argv<T = object> = Arguments<T & DefaultArgv>;

/**
 * Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.
 *
 * ```ts
 * type Argv = {
 *   'with-tacos'?: boolean;
 * };
 *
 * export const builder: Builder<Argv> = (yargs) =>
 * 	yargs.usage(`$0 ${command}`)
 * 		.option('with-tacos', {
 * 			description: 'Include tacos',
 * 			type: 'boolean',
 * 		});
 * ```
 */
export type Builder<U = object> = (argv: Yargs) => Yargv<U>;

/**
 * Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.
 *
 * ```ts
 * type Argv = {
 *   'with-tacos'?: boolean;
 * };
 * export const handler: Handler<Argv> = (argv, { logger }) => {
 * 	const { 'with-tacos': withTacos } = argv;
 * 	logger.log(withTacos ? 'Include tacos' : 'No tacos, thanks');
 * };
 * ```
 */
export type Handler<T = object> = (argv: Argv<T>, extra: HandlerExtra) => Promise<void>;

export type TaskDef = {
	/**
	 * Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.
	 */
	match?: string;
	/**
	 * String command to run. Special values include:
	 * - `$0`: the oneRepo CLI for your repository
	 * - `${workspaces}`: replaced with a space-separated list of workspace names necessary for the given lifecycle
	 */
	cmd: string;
	/**
	 * Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.
	 */
	meta?: Record<string, unknown>;
};
/**
 * A Task can either be a string or TaskDef object with extra options.
 */
export type Task = string | TaskDef;

export type Tasks = {
	sequential?: Array<Task>;
	parallel?: Array<Task>;
};

export type StandardLifecycles = 'commit' | 'checkout' | 'merge' | 'build' | 'deploy' | 'publish';
type MakeLifecycles<T extends string> = `pre-${T}` | T | `post-${T}`;
export type Lifecycle = MakeLifecycles<StandardLifecycles>;

export type TaskConfig<L extends string = never> = Partial<Record<Lifecycle | MakeLifecycles<L>, Tasks>>;
