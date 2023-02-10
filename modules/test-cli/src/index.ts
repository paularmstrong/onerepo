import path from 'node:path';
import Yargs from 'yargs';
import parser from 'yargs-parser';
import unparser from 'yargs-unparser';
import type { Arguments } from 'yargs-unparser';
import { getAffected, getFilepaths, getWorkspaces, parserConfiguration, setupYargs } from '@onerepo/cli';
import { Logger } from '@onerepo/logger';
import type { MiddlewareFunction } from 'yargs';
import type { Argv, Builder, Handler, HandlerExtra } from '@onerepo/cli';
import { getGraph } from '@onerepo/graph';

const logger = new Logger({ verbosity: 0 });

const testRunner: typeof vitest =
	// @ts-ignore
	typeof jest !== 'undefined' ? jest : typeof vitest !== 'undefined' ? vitest : null;

export async function runBuilder<R = Record<string, unknown>>(builder: Builder<R>, cmd = ''): Promise<Argv<R>> {
	const inputArgs = parser(cmd, {
		configuration: parserConfiguration,
	});

	process.argv[1] = 'test-runner';
	const yargs = Yargs(unparser(inputArgs as Arguments).join(' '));

	testRunner.spyOn(yargs, 'exit').mockImplementation(() => {
		throw new Error('Process unexpectedly exited early');
	});

	const middlewares: Array<MiddlewareFunction> = [];

	testRunner.spyOn(yargs, 'middleware').mockImplementation((middleware) => {
		middlewares.push(...(Array.isArray(middleware) ? middleware : [middleware]));
		return yargs;
	});
	testRunner.spyOn(yargs, 'showHelp').mockImplementation(
		// @ts-ignore not sure if safe, but prevents writing help to stderr
		() => ''
	);

	if (typeof builder !== 'function') {
		throw new Error('Builder must be a function');
	}

	const out = builder(setupYargs(yargs).default('verbosity', 0).demandCommand(0));

	const resolvedOut = await (out instanceof Promise ? out : Promise.resolve(out));

	const { ...argv } = resolvedOut.argv;

	middlewares.forEach((middleware) => {
		middleware(argv);
	});

	return { ...argv, $0: 'root-bin' };
}

export async function runHandler<R = Record<string, unknown>>(
	{
		builder,
		handler,
		extras = {},
	}: {
		builder: Builder<R>;
		handler: Handler<R>;
		extras: Partial<Extras>;
	},
	cmd = ''
): Promise<void> {
	const { graph = getGraph(path.join(__dirname, '__fixtures__', 'repo')) } = extras;
	const argv = await runBuilder(builder, cmd);

	const wrappedGetAffected = (opts?: Parameters<typeof getAffected>[1]) => getAffected(graph, opts);

	const wrappedGetWorkspaces = () =>
		getWorkspaces(
			graph,
			// @ts-ignore
			argv
		);

	const wrappedGetFilepaths = () =>
		getFilepaths(
			graph,
			// @ts-ignore
			argv
		);

	await handler(argv, {
		logger,
		getAffected: wrappedGetAffected,
		getFilepaths: wrappedGetFilepaths,
		getWorkspaces: wrappedGetWorkspaces,
		graph,
	});
}

export function getCommand<R = Record<string, unknown>>({
	builder,
	handler,
}: {
	builder: Builder<R>;
	handler: Handler<R>;
}) {
	return {
		build: async (cmd = '') => runBuilder<R>(builder, cmd),
		run: async (cmd = '', extras: Partial<Extras> = {}) => runHandler<R>({ builder, handler, extras }, cmd),
	};
}

type Extras = Omit<HandlerExtra, 'getAffected' | 'getFilepaths' | 'getWorkspaces' | 'logger'>;
