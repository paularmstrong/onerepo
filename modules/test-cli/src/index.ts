import { PassThrough } from 'node:stream';
import path from 'node:path';
import url from 'node:url';
import Yargs from 'yargs';
import * as builders from '@onerepo/builders';
import { parserConfiguration, setupYargs } from '@onerepo/yargs';
import { getLogger, Logger } from '@onerepo/logger';
import type { Graph } from '@onerepo/graph';
import { getGraph } from '@onerepo/graph';
import type { MiddlewareFunction } from 'yargs';
import type { Argv, Builder, Handler, HandlerExtra } from '@onerepo/yargs';

process.env.npm_config_user_agent = undefined;
delete process.env.npm_config_user_agent;

// @ts-ignore
const testRunner: typeof vitest | typeof jest =
	// @ts-ignore
	typeof jest !== 'undefined' ? jest : typeof vitest !== 'undefined' ? vitest : null;

// esbuild-jest issue, if a "(" comes after "ock", esbuild will not transform the file.
const mocker = testRunner.mock;
mocker('yargs');

async function runBuilder<R = Record<string, unknown>>(
	builder: Builder<R>,
	cmd = '',
	graph: Graph,
	builderExtras?: BuilderExtras,
): Promise<Argv<R>> {
	process.env = {
		...process.env,
		ONE_REPO_HEAD_BRANCH: 'main',
		...(builderExtras?.env ?? {}),
	};

	process.argv[1] = builderExtras?.executable ?? 'onerepo-test-runner';

	const spy = testRunner.spyOn(console, 'error').mockImplementation(() => {});

	const yargs = Yargs(cmd).parserConfiguration(parserConfiguration);

	testRunner.spyOn(yargs, 'exit').mockImplementation((code: number, err: Error) => {
		throw err;
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
		() => '',
	);

	if (typeof builder !== 'function') {
		throw new Error('Builder must be a function');
	}

	const out = builder(setupYargs(yargs, { graph, logger: getLogger() }).demandCommand(0));

	const resolvedOut = await (out instanceof Promise ? out : Promise.resolve(out));

	const { ...argv } = resolvedOut.argv;

	for (const middleware of middlewares) {
		await middleware(argv);
	}

	spy.mockClear();

	return { ...argv, $0: 'root-bin' };
}

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.resolve(path.dirname(url.fileURLToPath(import.meta.url)));

async function runHandler<R = Record<string, unknown>>(
	{
		builder,
		handler,
		extras = {},
	}: {
		builder: Builder<R>;
		handler: Handler<R>;
		extras: Partial<Extras>;
	},
	cmd = '',
): Promise<string> {
	let out = '';
	const stream = new PassThrough();
	stream.on('data', (chunk) => {
		out += chunk.toString();
	});
	const logger = new Logger({ verbosity: 5, stream });

	const { builderExtras, graph = getGraph(path.join(dirname, 'fixtures', 'repo')) } = extras;
	const argv = await runBuilder(builder, cmd, graph, builderExtras);

	const wrappedGetAffected = (opts?: Parameters<typeof builders.getAffected>[1]) => builders.getAffected(graph, opts);
	const wrappedGetWorkspaces = (opts?: Parameters<typeof builders.getWorkspaces>[2]) =>
		builders.getWorkspaces(graph, argv as builders.Argv, opts);
	const wrappedGetFilepaths = (opts?: Parameters<typeof builders.getFilepaths>[2]) =>
		builders.getFilepaths(graph, argv as builders.Argv, opts);

	const error: unknown = undefined;
	await handler(argv, {
		logger,
		getAffected: wrappedGetAffected,
		getFilepaths: wrappedGetFilepaths,
		getWorkspaces: wrappedGetWorkspaces,
		graph,
		config: {},
	});

	await logger.end();

	if (logger.hasError || error) {
		return Promise.reject(out || error);
	}

	return out;
}

export function getCommand<R = Record<string, unknown>>(
	{
		builder,
		handler,
	}: {
		builder: Builder<R>;
		handler: Handler<R>;
	},
	graph: Graph = getGraph(path.join(dirname, 'fixtures', 'repo')),
) {
	return {
		build: async (cmd = '', extras?: BuilderExtras) => runBuilder<R>(builder, cmd, graph, extras),
		graph,
		run: async (cmd = '', extras: Partial<Extras> = {}) =>
			runHandler<R>({ builder, handler, extras: { graph, ...extras } }, cmd),
	};
}

type Extras = { builderExtras?: BuilderExtras } & Omit<
	HandlerExtra,
	'getAffected' | 'getFilepaths' | 'getWorkspaces' | 'logger'
>;

type BuilderExtras = {
	executable?: string;
	env?: Exclude<typeof process.env, 'clear'>;
};
