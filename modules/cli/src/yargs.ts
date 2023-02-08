import { performance } from 'node:perf_hooks';
import type { Argv as Yargv, RequireDirectoryOptions } from 'yargs';
import type { Repository } from '@onerepo/graph';
import type { Logger } from '@onerepo/logger';
import { logger } from './logger';
import { BatchError, SubprocessError } from './functions/subprocess';
import { version } from '../package.json';
import { getAffected, getFilepaths, getWorkspaces } from './functions/getters';
import type { GetterArgv } from './functions/getters';
import type { Workspace } from '@onerepo/graph';

export interface DefaultArgv {
	ci: boolean;
	'dry-run': boolean;
	silent: boolean;
	verbosity: number;
}

// Reimplementation of this type from Yargs because we do not allow unknowns, nor camelCase
export type Arguments<T = object> = { [key in keyof T as key]: T[key] } & {
	/** Non-option arguments */
	_: Array<string | number>;
	/** The script name or node command */
	$0: string;
	/** Any content that comes after " -- " gets populated here */
	'--': Array<string>;
};

export type Yargs<T = DefaultArgv> = Yargv<T>;
export type Argv<T = object> = Arguments<T & DefaultArgv>;
// export type Builder<T = object> = CommandBuilder<Argv<DefaultArgv>, T>;
export type Builder<U = object> = (argv: Yargs) => Yargv<U>;
export type Handler<T = object> = (argv: Argv<T>, extra: HandlerExtra) => Promise<void>;

export type HandlerExtra = {
	getAffected: (opts?: Parameters<typeof getAffected>[1]) => ReturnType<typeof getAffected>;
	getFilepaths: () => Promise<Array<string>>;
	getWorkspaces: () => Promise<Array<Workspace>>;
	graph: Repository;
	logger: Logger;
};

export function setupYargs(yargs: Yargv): Yargs {
	return (
		yargs
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
				default: 1,
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
			.option('ci', {
				default: false,
				description: 'Sets defaults for running scripts in a CI environment',
				global: true,
				group: 'Global:',
				hidden: true,
				type: 'boolean',
			})
			.middleware([
				// eslint-disable-next-line @typescript-eslint/ban-types
				function setEnvironmentMiddleware(argv: Omit<Argv, '--'>) {
					process.env.ONE_REPO_DRY_RUN = `${argv['dry-run']}`;
					process.env.ONE_REPO_CI = `${argv.ci}`;
					argv.verbosity = argv.silent ? 0 : argv.verbosity;
					process.env.ONE_REPO_VERBOSITY = `${argv.verbosity}`;
					logger.verbosity = argv.verbosity;
				},
				function sudoCheckMiddleware() {
					if (process.env.SUDO_UID) {
						throw new Error(
							'Do not run commands with `sudo`! If elevated permissions are required, commands will prompt you for your password only if and when necessary.'
						);
					}
				},
			])
			.wrap(Math.min(160, process.stdout.columns))
			.showHidden('show-advanced', 'Show advanced options')
			.group('show-advanced', 'Global:')
			.global('show-advanced')
			.group('help', 'Global:')
			// .global('help')
			.version('version', 'Show the one Repo CLI version', version)
			.hide('version')
			.strict()
			.demandCommand(1, 'Please enter a command')
			.parserConfiguration(parserConfiguration)
	);
}

export const parserConfiguration = {
	'strip-aliased': true,
	'camel-case-expansion': false,
	'greedy-arrays': true,
	'populate--': true,
};

function fallbackHandler(argv: Arguments<DefaultArgv>) {
	throw new Error(`No handler defined for command ${argv.$0}`);
}

export const commandDirOptions = (
	graph: Repository,
	exclude?: RegExp
): RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> } => ({
	extensions: ['ts', 'js', 'cjs', 'mjs'],
	exclude,
	recurse: false,
	visit: function visitor(command) {
		const { handler, ...rest } = command;
		return {
			...rest,
			handler: async (argv: Arguments<DefaultArgv>) => {
				performance.mark('one_handler_start');
				logger.debug(`Resolved CLI arguments:
${JSON.stringify(argv, null, 2)}`);

				const wrappedGetAffected = (opts?: Parameters<typeof getAffected>[1]) => getAffected(graph, opts);
				const wrappedGetWorkspaces = () => getWorkspaces(graph, argv as GetterArgv);
				const wrappedGetFilepaths = () => getFilepaths(graph, argv as GetterArgv);

				process.on('unhandledRejection', (reason, promise) => {
					throw new Error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
				});

				try {
					if (handler) {
						await handler(argv, {
							getAffected: wrappedGetAffected,
							getFilepaths: wrappedGetFilepaths,
							getWorkspaces: wrappedGetWorkspaces,
							graph,
							logger,
						});
					} else {
						fallbackHandler(argv);
					}
				} catch (err) {
					if (err && !(err instanceof SubprocessError) && !(err instanceof BatchError)) {
						logger.error(err);
						throw err;
					}

					process.exitCode = 1;
				} finally {
					performance.mark('one_shutdown');
					logger.timing('one_handler_start', 'one_shutdown');
					logger.timing('one_startup', 'one_shutdown');
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
