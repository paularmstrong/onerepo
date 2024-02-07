import { performance } from 'node:perf_hooks';
import { BatchError, SubprocessError } from '@onerepo/subprocess';
import * as builders from '@onerepo/builders';
import type { Logger } from '@onerepo/logger';
import type { Graph, Workspace } from '@onerepo/graph';
import type { Argv as Yargv, RequireDirectoryOptions } from 'yargs';
import type { RootConfig } from 'onerepo';
import { checkEnginesMiddleware, setEnvironmentMiddleware, sudoCheckMiddleware } from './middleware';

/**
 * @internal
 */
export function setupYargs(yargs: Yargv, { graph, logger }: { graph?: Graph; logger: Logger }): Yargs {
	const retYargs = yargs
		.usage('$0 <command> [options...]')
		.help('help', 'Show this help screen')
		.alias('help', 'h')
		.option('dry-run', {
			default: false,
			description: 'Run without actually making modifications or destructive operations',
			global: true,
			group: 'Global:',
			type: 'boolean',
		})
		.option('verbosity', {
			alias: 'v',
			default: 2,
			description:
				'Set the verbosity of the script output. Increase verbosity with `-vvv`, `-vvvv`, or `-vvvvv`. Reduce verbosity with `-v` or `--quiet`',
			global: true,
			group: 'Global:',
			type: 'count',
		})
		.option('quiet', {
			alias: ['q'],
			type: 'boolean',
			group: 'Global:',
			global: true,
			hidden: true,
			default: false,
			description: 'Silence all output from the logger. Effectively sets verbosity to 0.',
		})
		.option('skip-engine-check', {
			type: 'boolean',
			group: 'Global:',
			global: true,
			hidden: true,
			default: false,
			description: 'Skip the engines check, which ensures the current Node.js version is within the expected range.',
		})
		.middleware(setEnvironmentMiddleware, true)
		.middleware(sudoCheckMiddleware(yargs, logger), true);

	if (graph && logger) {
		retYargs.middleware(checkEnginesMiddleware(yargs, graph, logger), true);
	}

	return retYargs
		.wrap(Math.min(160, process.stdout.columns))
		.showHidden('show-advanced', 'Pair with `--help` to show advanced options.')
		.group('show-advanced', 'Global:')
		.global('show-advanced')
		.group('help', 'Global:')
		.strict()
		.demandCommand(1, 'Please enter a command')
		.parserConfiguration(parserConfiguration);
}

/**
 * @internal
 */
export const parserConfiguration = {
	'strip-aliased': true,
	'camel-case-expansion': false,
	'greedy-arrays': true,
	'populate--': true,
	'sort-commands': true,
};

function fallbackHandler(argv: Arguments<DefaultArgv>) {
	throw new Error(`No handler defined for command ${argv.$0}`);
}

type CommandDirOpts = {
	graph: Graph;
	exclude?: RegExp;
	startup: (argv: Arguments<DefaultArgv>) => Promise<void>;
	/**
	 * @internal
	 */
	config: Required<RootConfig>;
	logger: Logger;
};

/**
 * @internal
 */
export const commandDirOptions = ({
	exclude,
	graph,
	startup,
	config,
	logger,
}: CommandDirOpts): RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> } => ({
	extensions: ['ts', 'js', 'cjs', 'mjs'],
	exclude,
	recurse: false,
	visit: function visitor(commandModule) {
		const { command, description, handler, builder } = commandModule;

		// Very arbitrary, but require at least 4 words in the description to help end users
		if (description !== false && description.split(' ').length < 3) {
			throw new Error(`Please enter a meaningful description for "${Array.isArray(command) ? command[0] : command}"`);
		}

		return {
			command,
			description,
			// Need to re-attach `.showHidden()` to due a bug in Yargs in which commadDir doesn't respond to it, even though it does get listed in the `--help` output
			builder: (yargs: Yargs) =>
				builder(yargs)
					.version(false)
					.showHidden('show-advanced', 'Pair with `--help` to show advanced options.')
					.group('show-advanced', 'Global:')
					.global('show-advanced'),
			handler: async (argv: Arguments<DefaultArgv>) => {
				performance.mark('onerepo_start_Startup hooks');
				await startup(argv);
				performance.mark('onerepo_end_Pre-Startup hooks');

				performance.mark(`onerepo_start_Handler: ${command}`);
				logger.debug(`Resolved CLI arguments:
${JSON.stringify(argv, null, 2)}`);

				const wrappedGetAffected = (opts?: Parameters<typeof builders.getAffected>[1]) =>
					builders.getAffected(graph, opts);
				const wrappedGetWorkspaces = (opts?: Parameters<typeof builders.getWorkspaces>[2]) =>
					builders.getWorkspaces(graph, argv as builders.Argv, opts);
				const wrappedGetFilepaths = (opts?: Parameters<typeof builders.getFilepaths>[2]) =>
					builders.getFilepaths(graph, argv as builders.Argv, opts);

				process.on('unhandledRejection', (reason, promise) => {
					throw new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
				});

				const extra: HandlerExtra = {
					getAffected: wrappedGetAffected,
					getFilepaths: wrappedGetFilepaths,
					getWorkspaces: wrappedGetWorkspaces,
					graph,
					logger,
					config,
				};

				try {
					if (handler) {
						await handler(argv, extra);
					} else {
						fallbackHandler(argv);
					}
				} catch (err) {
					if (err instanceof BatchError || (err && !(err instanceof SubprocessError))) {
						logger.error(err);
					}

					process.exitCode = 1;
				}

				performance.mark(`onerepo_end_Handler: ${command}`);

				logger.timing(`onerepo_start_Handler: ${command}`, `onerepo_end_Handler: ${command}`);

				if (logger.hasError) {
					process.exitCode = 1;
				}
			},
		};
	},
});

/**
 * Default arguments provided globally for all commands. These arguments are included by when using {@link Builder | `Builder`} and {@link Handler | `Handler`}.
 *
 * @group Commands
 */
export type DefaultArgv = {
	/**
	 * Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.
	 *
	 * Also internally sets `process.env.ONEREPO_DRY_RUN = 'true'`.
	 * @default `false`
	 */
	'dry-run': boolean;
	/**
	 * Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.
	 * @default `false`
	 */
	quiet: boolean;
	/**
	 * Verbosity level for the Logger. See Logger.verbosity for more information.
	 * @default `3`
	 */
	verbosity: number;
	/**
	 * Skip the engines check. When `false`, oneRepo will the current process's node version with the range for `engines.node` as defined in `package.json`. If not defined in the root `package.json`, this will be skipped.
	 * @default `false`
	 */
	'skip-engine-check': boolean;
};

/**
 * Always present in Builder and Handler arguments as parsed by Yargs.
 *
 * @group Commands
 */
export type PositionalArgv = {
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
};
/**
 * Reimplementation of this type from Yargs because we do not allow unknowns, nor camelCase
 *
 * @typeParam CommandArgv Arguments that will be parsed for this command
 *
 * @group Commands
 * @internal
 */
export type Arguments<CommandArgv = object> = { [key in keyof CommandArgv]: CommandArgv[key] } & PositionalArgv;

/**
 * A [yargs object](http://yargs.js.org/docs/).
 *
 * @group Commands
 * @internal
 */
export type Yargs<CommandArgv = DefaultArgv> = Yargv<CommandArgv>;

/**
 * Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.
 *
 * @typeParam CommandArgv Arguments that will be parsed for this command, always a union with {@link DefaultArgv | `DefaultArgv`} and {@link PositionalArgv | `PositionalArgv`}.
 * @group Commands
 */
export type Argv<CommandArgv = object> = Arguments<CommandArgv & DefaultArgv>;

/**
 * Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.
 *
 * All extras are available as the second argument on your {@link Handler | `Handler`}
 * ```ts
 * export const handler: Handler = (argv, { getAffected, getFilepaths, getWorkspace, logger }) => {
 * 	logger.warn('Nothing to do!');
 * };
 * ```
 *
 * Overriding the affected threshold in `getFilepaths`
 * ```ts
 * export const handler: Handler = (argv, { getFilepaths }) => {
 * 	const filepaths = await getFilepaths({ affectedThreshold: 0 });
 * };
 * ```
 *
 * @group Commands
 */
export type HandlerExtra = {
	/**
	 * Get the affected Workspaces based on the current state of the repository.
	 *
	 * This is a wrapped implementation of {@link builders.getAffected | `builders.getAffected`} that does not require passing the `graph` argument.
	 */
	getAffected: (opts?: builders.GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * Get the affected filepaths based on the current inputs and state of the repository. Respects manual inputs provided by {@link builders.withFiles | `builders.withFiles`} if provided.
	 *
	 * This is a wrapped implementation of {@link builders.getFilepaths | `builders.getFilepaths`} that does not require the `graph` and `argv` arguments.
	 *
	 * **Note:** that when used with `--affected`, there is a default limit of 100 files before this will switch to returning affected Workspace paths. Use `affectedThreshold: 0` to disable the limit.
	 *
	 */
	getFilepaths: (opts?: builders.FileGetterOptions) => Promise<Array<string>>;
	/**
	 * Get the affected Workspaces based on the current inputs and the state of the repository.
	 * This function differs from `getAffected` in that it respects all input arguments provided by
	 * {@link builders.withWorkspaces | `builders.withWorkspaces`}, {@link builders.withFiles | `builders.withFiles`} and {@link builders.withAffected | `builders.withAffected`}.
	 *
	 * This is a wrapped implementation of {@link builders.getWorkspaces | `builders.getWorkspaces`} that does not require the `graph` and `argv` arguments.
	 */
	getWorkspaces: (opts?: builders.GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * The full monorepo {@link Graph | `Graph`}.
	 */
	graph: Graph;
	/**
	 * Standard {@link Logger | `Logger`}. This should _always_ be used in place of `console.log` methods unless you have
	 * a specific need to write to standard out differently.
	 */
	logger: Logger;
	/**
	 * @internal
	 */
	config: Required<RootConfig>;
};

/**
 * Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.
 *
 * For common arguments that work in conjunction with {@link HandlerExtra | `HandlerExtra`} methods like `getAffected()`, you can use helpers from the {@link builders! | `builders` namespace}, like {@link builders!withAffected | `builders.withAffected()`}.
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
 *
 * @typeParam CommandArgv Arguments that will be parsed for this command
 * @param yargs The Yargs instance. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule)
 *
 * @see [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
 * @see Common extensions via the {@link !builders | `builders`} namespace.
 *
 * @group Commands
 */
export type Builder<CommandArgv = object> = (yargs: Yargs) => Yargv<CommandArgv>;

/**
 * Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.
 *
 * ```ts
 * type Argv = {
 *   'with-tacos'?: boolean;
 * };
 * export const handler: Handler<Argv> = (argv, { logger }) => {
 * 	const { 'with-tacos': withTacos, '--': passthrough } = argv;
 * 	logger.log(withTacos ? 'Include tacos' : 'No tacos, thanks');
 *  logger.debug(passthrough);
 * };
 * ```
 *
 * @typeParam CommandArgv Arguments that will be parsed for this command. DefaultArguments will be automatically merged into this object for use within the handler.
 *
 * @see [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
 * @see {@link HandlerExtra | `HandlerExtra`} for extended extra arguments provided above and beyond the scope of Yargs.
 *
 * @group Commands
 */
export type Handler<CommandArgv = object> = (argv: Argv<CommandArgv>, extra: HandlerExtra) => Promise<void>;
