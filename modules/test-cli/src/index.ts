import path from 'node:path';
import url from 'node:url';
import Yargs from 'yargs';
import parser from 'yargs-parser';
import unparser from 'yargs-unparser';
import type { Arguments } from 'yargs-unparser';
import { getters } from '@onerepo/builders';
import type { Argv, Builder, Handler, HandlerExtra } from '@onerepo/yargs';
import { parserConfiguration, setupYargs } from '@onerepo/yargs';
import { logger } from '@onerepo/logger';
import type { MiddlewareFunction } from 'yargs';
import { getGraph } from '@onerepo/graph';

// @ts-ignore
const testRunner: typeof vitest | typeof jest =
	// @ts-ignore
	typeof jest !== 'undefined' ? jest : typeof vitest !== 'undefined' ? vitest : null;

// esbuild-jest issue, if a "(" comes after "ock", esbuild will not transform the file.
const mocker = testRunner.mock;
mocker('yargs');

export async function runBuilder<R = Record<string, unknown>>(builder: Builder<R>, cmd = ''): Promise<Argv<R>> {
	const inputArgs = parser(cmd, {
		configuration: parserConfiguration,
	});

	process.env.ONE_REPO_VERBOSITY = '4';
	process.env.ONE_REPO_HEAD_BRANCH = 'main';
	logger.verbosity = 4;
	process.argv[1] = 'onerepo-test-runner';

	const spy = testRunner.spyOn(console, 'error').mockImplementation(() => {});

	const yargs = Yargs(unparser(inputArgs as Arguments).join(' '));

	testRunner.spyOn(yargs, 'exit').mockImplementation(() => {
		throw new Error('Process unexpectedly exited early');
	});

	const middlewares: Array<MiddlewareFunction> = [];

	testRunner
		.spyOn(yargs, 'middleware')
		.mockImplementation((middleware: MiddlewareFunction | Array<MiddlewareFunction>) => {
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

	spy.mockClear();

	return { ...argv, $0: 'root-bin' };
}

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.resolve(path.dirname(url.fileURLToPath(import.meta.url)));

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
	logger.hasError = false;
	logger.verbosity = 4;
	logger.pause();

	const { graph = getGraph(path.join(dirname, 'fixtures', 'repo')) } = extras;
	const argv = await runBuilder(builder, cmd);

	const wrappedGetAffected = (opts?: Parameters<typeof getters.affected>[1]) => getters.affected(graph, opts);
	const wrappedGetWorkspaces = (opts?: Parameters<typeof getters.workspaces>[2]) =>
		getters.workspaces(graph, argv as getters.Argv, opts);
	const wrappedGetFilepaths = (opts?: Parameters<typeof getters.filepaths>[2]) =>
		getters.filepaths(graph, argv as getters.Argv, opts);

	let error: unknown = undefined;
	try {
		await handler(argv, {
			logger,
			getAffected: wrappedGetAffected,
			getFilepaths: wrappedGetFilepaths,
			getWorkspaces: wrappedGetWorkspaces,
			graph,
		});
	} catch (e) {
		error = e;
	}

	// await logger.end();

	await new Promise<void>((resolve, reject) => {
		setImmediate(() => {
			if (logger.hasError || error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export function getCommand<R = Record<string, unknown>>({
	builder,
	handler,
}: {
	builder: Builder<R>;
	handler: Handler<R>;
}) {
	const graph = getGraph(path.join(dirname, 'fixtures', 'repo'));
	return {
		build: async (cmd = '') => runBuilder<R>(builder, cmd),
		graph,
		run: async (cmd = '', extras: Partial<Extras> = {}) =>
			runHandler<R>({ builder, handler, extras: { graph, ...extras } }, cmd),
	};
}

type Extras = Omit<HandlerExtra, 'getAffected' | 'getFilepaths' | 'getWorkspaces' | 'logger'>;
