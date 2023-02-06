import Yargs from 'yargs';
import parser from 'yargs-parser';
import unparser from 'yargs-unparser';
import type { Arguments } from 'yargs-unparser';
import { getAffected, parserConfiguration, setupYargs } from '@onerepo/cli';
import { Logger } from '@onerepo/logger';
import type { MiddlewareFunction } from 'yargs';
import type { Argv, Builder, Handler, HandlerExtra } from '@onerepo/cli';

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

	middlewares.forEach((m) => {
		m(argv);
	});

	return { ...argv, $0: 'root-bin' };
}

export async function runHandler<R = Record<string, unknown>>(
	{
		builder,
		handler,
		extras,
	}: {
		builder: Builder<R>;
		handler: Handler<R>;
		extras: Extras;
	},
	cmd: string = ''
): Promise<void> {
	const argv = await runBuilder(builder, cmd);
	const wrappedGetAffected = (since?: Parameters<typeof getAffected>[1], opts?: Parameters<typeof getAffected>[2]) =>
		getAffected(extras.graph, since, opts);
	await handler(argv, { logger, getAffected: wrappedGetAffected, ...extras });
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
		run: async (cmd = '', extras: Extras) => runHandler<R>({ builder, handler, extras }, cmd),
	};
}

type Extras = Omit<HandlerExtra, 'getAffected' | 'logger'>;
