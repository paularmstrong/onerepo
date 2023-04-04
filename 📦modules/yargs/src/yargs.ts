import { performance } from 'node:perf_hooks';
import { logger } from '@onerepo/logger';
import { BatchError, SubprocessError } from '@onerepo/subprocess';
import { getters } from '@onerepo/builders';
import type { Logger } from '@onerepo/logger';
import type { Graph, Workspace } from '@onerepo/graph';
import type { Argv as Yargv, RequireDirectoryOptions } from 'yargs';
import { setEnvironmentMiddleware, sudoCheckMiddleware } from './middleware';

/**
 * @internal
 */
export function setupYargs(yargs: Yargv): Yargs {
	return yargs
		.usage('$0 <command> [options]')
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
			description: 'Set the verbosity of the script output. Use -v, -vv, or -vvv for more verbose',
			global: true,
			group: 'Global:',
			type: 'count',
		})
		.option('silent', {
			type: 'boolean',
			group: 'Global:',
			global: true,
			hidden: true,
			default: false,
			description: 'Silence all output from the logger. Effectively sets verbosity to 0.',
		})
		.middleware(setEnvironmentMiddleware, true)
		.middleware(sudoCheckMiddleware(yargs), true)
		.wrap(Math.min(160, process.stdout.columns))
		.showHidden('show-advanced', 'Show advanced options')
		.group('show-advanced', 'Global:')
		.global('show-advanced')
		.group('help', 'Global:')
		.version(false)
		.hide('version')
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
};

function fallbackHandler(argv: Arguments<DefaultArgv>) {
	throw new Error(`No handler defined for command ${argv.$0}`);
}

type CommandDirOpts = {
	graph: Graph;
	exclude?: RegExp;
	preHandler: (argv: Arguments<DefaultArgv>, extra: HandlerExtra) => Promise<void>;
	postHandler: (argv: Arguments<DefaultArgv>, extra: HandlerExtra) => Promise<void>;
};

/**
 * @internal
 */
export const commandDirOptions = ({
	exclude,
	graph,
	preHandler,
	postHandler,
}: CommandDirOpts): RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> } => ({
	extensions: ['ts', 'js', 'cjs', 'mjs'],
	exclude,
	recurse: false,
	visit: function visitor(commandModule) {
		const { command, description, handler, ...rest } = commandModule;

		// Very arbitrary, but require at least 4 words in the description to help end users
		if (description !== false && description.split(' ').length < 3) {
			throw new Error(`Please enter a meaningful description for "${Array.isArray(command) ? command[0] : command}"`);
		}

		return {
			command,
			description,
			...rest,
			handler: async (argv: Arguments<DefaultArgv>) => {
				performance.mark('one_handler_start');
				logger.debug(`Resolved CLI arguments:
${JSON.stringify(argv, null, 2)}`);

				const wrappedGetAffected = (opts?: Parameters<typeof getters.affected>[1]) => getters.affected(graph, opts);
				const wrappedGetWorkspaces = (opts?: Parameters<typeof getters.workspaces>[2]) =>
					getters.workspaces(graph, argv as getters.Argv, opts);
				const wrappedGetFilepaths = (opts?: Parameters<typeof getters.filepaths>[2]) =>
					getters.filepaths(graph, argv as getters.Argv, opts);

				process.on('unhandledRejection', (reason, promise) => {
					throw new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
				});

				const extra: HandlerExtra = {
					getAffected: wrappedGetAffected,
					getFilepaths: wrappedGetFilepaths,
					getWorkspaces: wrappedGetWorkspaces,
					graph,
					logger,
				};

				await preHandler(argv, extra);

				try {
					if (handler) {
						await handler(argv, extra);
					} else {
						fallbackHandler(argv);
					}
				} catch (err) {
					if (err instanceof BatchError) {
						logger.error(err);
					}
					if (err && !(err instanceof SubprocessError) && !(err instanceof BatchError)) {
						logger.error(err);
						throw err;
					}

					process.exitCode = 1;
				} finally {
					performance.mark('one_shutdown');
					await postHandler(argv, extra);
					logger.timing('one_handler_start', 'one_shutdown');
					logger.timing('one_startup', 'one_shutdown');
					if (performance.getEntriesByName('one_register').length) {
						logger.timing('one_register', 'one_startup');
					}
					await logger.end();
					setImmediate(() => {
						if (logger.hasError) {
							process.exitCode = 1;
						}
						process.exit(process.exitCode);
					});
				}
			},
		};
	},
});

/**
 * Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#builder) and [`Handler`](#handler).
 *
 * @group Commands
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

/**
 * Always present in Builder and Handler arguments.
 *
 * @group Commands
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
/**
 * Reimplementation of this type from Yargs because we do not allow unknowns, nor camelCase
 *
 * @group Commands
 */
export type Arguments<T = object> = { [key in keyof T]: T[key] } & DefaultArguments;

/**
 * A [yargs object](http://yargs.js.org/docs/).
 *
 * @internal
 */
export type Yargs<T = DefaultArgv> = Yargv<T>;

/**
 * Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.
 *
 * @group Commands
 */
export type Argv<T = object> = Arguments<T & DefaultArgv>;

/**
 * Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.
 *
 * ```ts
 * export const handler: Handler = (argv, { getAffected, getFilepaths, getWorkspace, logger }) => {
 * 	logger.warn('Nothing to do!');
 * };
 * ```
 */
export interface HandlerExtra {
	/**
	 * Get the affected workspaces based on the current state of the repository. This is a wrapped implementation of {@link getters.affected | getters.affected} that does not require passing the `graph` argument.
	 */
	getAffected: (opts?: getters.GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * Get the affected filepaths based on the current inputs and state of the repository. This is a wrapped implementation of {@link getters.filepaths | getters.filepaths} that does not require the `graph` and `argv` arguments.
	 */
	getFilepaths: (opts?: getters.GetterOptions) => Promise<Array<string>>;
	/**
	 * Get the affected workspaces based on the current inputs and the state of the repository.
	 * This function differs from `getAffected` in that it respects input arguments provided by
	 * `withWorkspaces`, `withFiles` and `withAffected`. This is a wrapped implementation of {@link getters.workspaces | getters.workspaces} that does not require the `graph` and `argv` arguments.
	 */
	getWorkspaces: (opts?: getters.GetterOptions) => Promise<Array<Workspace>>;
	/**
	 * The full monorepo {@link Graph}.
	 */
	graph: Graph;
	/**
	 * Standard {@link Logger}. This should _always_ be used in place of `console.log` methods unless you have
	 * a specific need to write to standard out differently.
	 */
	logger: Logger;
}

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
 *
 * @group Commands
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
 *
 * @group Commands
 */
export type Handler<T = object> = (argv: Argv<T>, extra: HandlerExtra) => Promise<void>;
