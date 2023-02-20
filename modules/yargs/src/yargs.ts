import { performance } from 'node:perf_hooks';
import type { Argv as Yargv, RequireDirectoryOptions } from 'yargs';
import type { Repository } from '@onerepo/graph';
import { logger } from '@onerepo/logger';
import { BatchError, SubprocessError } from '@onerepo/subprocess';
import { getAffected, getFilepaths, getWorkspaces } from './getters';
import type { GetterArgv } from './getters';
import { setEnvironmentMiddleware, sudoCheckMiddleware } from './middleware';
import type { Arguments, DefaultArgv, HandlerExtra, Yargs } from '@onerepo/types';

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
		.option('ci', {
			default: false,
			description: 'Sets defaults for running scripts in a CI environment',
			global: true,
			group: 'Global:',
			hidden: true,
			type: 'boolean',
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
	graph: Repository;
	exclude?: RegExp;
	preHandler: (argv: Arguments<DefaultArgv>, extra: HandlerExtra) => Promise<void>;
	postHandler: (argv: Arguments<DefaultArgv>, extra: HandlerExtra) => Promise<void>;
};

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
		if (!description || description.split(' ').length < 3) {
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

				const wrappedGetAffected = (opts?: Parameters<typeof getAffected>[1]) => getAffected(graph, opts);
				const wrappedGetWorkspaces = (opts?: Parameters<typeof getWorkspaces>[2]) =>
					getWorkspaces(graph, argv as GetterArgv, opts);
				const wrappedGetFilepaths = (opts?: Parameters<typeof getFilepaths>[2]) =>
					getFilepaths(graph, argv as GetterArgv, opts);

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
