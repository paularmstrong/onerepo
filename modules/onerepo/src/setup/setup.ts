import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lstat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import defaults from 'defaults';
import { globSync } from 'glob';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import type { Graph } from '@onerepo/graph';
import { getGraph } from '@onerepo/graph';
import { Logger, getLogger } from '@onerepo/logger';
import type { RequireDirectoryOptions, Argv as Yargv } from 'yargs';
import type { Argv, DefaultArgv, Yargs } from '@onerepo/yargs';
import { flushUpdateIndex } from '@onerepo/git';
import type { Config, RootConfig, CorePlugins, PluginObject, Plugin } from '../types';
import pkg from '../../package.json';

export const defaultConfig: Required<RootConfig> = {
	root: true,
	changes: {
		filenames: 'hash',
		prompts: 'guided',
		formatting: {},
	},
	vcs: {
		autoSyncHooks: false,
		hooksPath: '.hooks',
		provider: 'github',
	},
	codeowners: {},
	head: 'main',
	ignore: [],
	commands: {
		directory: 'commands',
		ignore: /(\/__\w+__\/|\.test\.|\.spec\.|\.config\.)/,
	},
	plugins: [],
	dependencies: {
		dedupe: true,
		mode: 'loose',
	},
	visualizationUrl: 'https://onerepo.tools/visualize/',
	templateDir: './config/templates',
	validation: {
		schema: null,
	},
	taskConfig: {
		lifecycles: [],
		stashUnstaged: ['pre-commit'],
	},
	tasks: {},
	meta: {},
};

/**
 * Command-line application returned from {@link setup | `setup()`}.
 *
 * ```js
 * setup().then(({ run }) => run());
 * ```
 * @internal
 */
export type App = {
	/**
	 * (advanced) Further extend the yargs object before running the command handler. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more information.
	 */
	yargs: Yargs;
	/**
	 * Run the command handler.
	 */
	run: () => Promise<void>;
};

/**
 * Set up and run your command-line interface.
 *
 * ```js
 * setup({
 * 	name: 'one',
 * 	// ...config
 * }).then(({ run }) => run());
 * ```
 *
 * @internal
 */
export async function setup({
	graph: inputGraph,
	require,
	root,
	config = {},
	yargs: yargsInstance,
	corePlugins,
	logger: inputLogger,
}: {
	graph?: Graph;
	require?: NodeRequire;
	root: string;
	config: Config;
	yargs: Yargv;
	corePlugins: CorePlugins;
	logger?: Logger;
}): Promise<App> {
	const req = require ?? createRequire(process.cwd());
	const logger = inputLogger ?? getLogger();

	const { plugins: userPlugins, ...userConfig } = { plugins: [], ...config };
	const resolvedConfig = defaults(userConfig, defaultConfig) satisfies Required<RootConfig>;
	const { head } = resolvedConfig;

	process.env.ONEREPO_ROOT = getActualRoot(root);
	process.env.ONEREPO_HEAD_BRANCH = head;
	process.env.ONEREPO_DRY_RUN = 'false';

	const graph = await (inputGraph || getGraph(process.env.ONEREPO_ROOT));

	const yargs = setupYargs(yargsInstance.scriptName('one'), { graph, logger });
	yargs
		.version(pkg.version)
		.describe('version', 'Show the oneRepo CLI version.')
		.completion(`onerepo-completion`, false);

	const startupFns: Array<NonNullable<PluginObject['startup']>> = [];
	async function startup(argv: Argv<DefaultArgv>) {
		await Promise.all(startupFns.map((fn) => fn(argv)));
	}

	const shutdownFns: Array<NonNullable<PluginObject['shutdown']>> = [];
	async function shutdown(argv: Argv<DefaultArgv>): Promise<Array<Record<string, unknown> | void>> {
		return await Promise.all(shutdownFns.map((fn) => fn(argv)));
	}

	const options = commandDirOptions({
		graph,
		exclude: resolvedConfig.commands.ignore,
		startup,
		config: { ...resolvedConfig, plugins: userPlugins },
		logger,
	});

	yargs.commandDir = patchCommandDir(req, options, yargs.commandDir);
	// TODO: find a better way
	// more hacks - the patch function doesn't work with plugin-docgen
	if ('_commandDirOpts' in yargs) {
		yargs._commandDirOpts = options;
	}

	const plugins: Array<Plugin> = [...userPlugins];

	// Install the core plugins
	for (const plugin of Object.values(corePlugins)) {
		plugins.unshift(plugin);
	}

	// Other plugins
	for (const plugin of plugins) {
		const {
			yargs: pluginYargs,
			startup: startupHandler,
			shutdown: shutdownHandler,
		} = typeof plugin === 'function' ? plugin({ ...resolvedConfig, plugins: userPlugins }, graph) : plugin;
		if (typeof pluginYargs === 'function') {
			pluginYargs(yargs, options.visit);
		}
		if (typeof startupHandler === 'function') {
			startupFns.push(startupHandler);
		}
		if (typeof shutdownHandler === 'function' && process.env.ONEREPO_SPAWN !== '1') {
			shutdownFns.push(shutdownHandler);
		}
	}

	// Local commands
	if (resolvedConfig.commands.directory !== false) {
		const rootCommandPath = path.join(process.env.ONEREPO_ROOT, resolvedConfig.commands.directory!);
		if (existsSync(rootCommandPath)) {
			const stat = await lstat(rootCommandPath);
			if (stat.isDirectory()) {
				yargs.commandDir(rootCommandPath);
			}
		}
	}

	return {
		yargs,
		run: async () => {
			// @ts-expect-error Yargs types are slightly incorrect here, missing `'--': Array<string>`.
			const argv = (await yargs.parse()) as Argv<DefaultArgv>;

			await flushUpdateIndex();

			performance.mark('onerepo_end_Program', {
				detail:
					'The measure of time from the beginning of parsing program setup and CLI arguments through the end of the handler & any postHandler options.',
			});

			const logger = getLogger();

			// allow the last performance mark to propagate to observers. Super hacky.
			await new Promise<void>((resolve) => {
				setImmediate(() => {
					resolve();
				});
			});

			await logger.end();

			// Register a new logger on the  top of the stack to silence output so that shutdown handlers to not write any output
			const silencedLogger = new Logger({ verbosity: 0 });
			await shutdown(argv);
			await silencedLogger.end();
		},
	};
}

/**
 * Recursively patch the yarg's instance `commandDir` to ensure our options are always set.
 * This ensures things like the include/exclude are set, but more importantly:
 *
 * 1. Ensures that the command handler is enclosed with async handling for logging purposes.
 * 2. Enables `commandDir` in ESM. https://github.com/yargs/yargs/issues/571
 *
 * Ideally we would use something safer like a Proxy, but basically all of yargs is internal private,
 * which Proxies cannot handle. There's a long discussion about this, but tl;dr: too bad.
 * https://github.com/tc39/proposal-class-fields/issues/106
 */
function patchCommandDir(
	require: NodeRequire,
	options: RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> },
	commandDir: Yargs['commandDir'],
) {
	return function (this: Yargs, pathname: string) {
		const files = globSync(
			`${pathname}${options.recurse ? '/**' : ''}/*${options.extensions ? `.{${options.extensions.join(',')}}` : ''}`,
			{
				nodir: true,
			},
		);
		this.commandDir = patchCommandDir(require, options, commandDir);

		for (const file of files) {
			if (typeof options.exclude === 'function') {
				if (options.exclude(file)) {
					continue;
				}
			} else if (options.exclude?.test(file)) {
				continue;
			}

			const cmd = require(file);
			const { command, description, builder, handler } = options.visit(cmd);
			this.command(command, description, builder, handler);
		}

		return this;
	};
}

function getActualRoot(root: string) {
	const rel = path.relative(root, process.cwd());
	if (rel.includes('..') && !root.includes('.onerepo')) {
		try {
			const out = execSync('git rev-parse --git-dir', { cwd: process.cwd() });
			const gitDir = out.toString().trim();

			if (path.relative(root, gitDir).includes('..')) {
				throw new Error('Not in a valid worktree');
			}

			if (/\/worktrees\//.test(gitDir)) {
				const newRoot = readFileSync(path.join(gitDir, 'gitdir'));
				return path.dirname(newRoot.toString().trim());
			}
			throw new Error('Not a valid worktree');
		} catch {
			throw new Error(
				`\nPlease change your working directory to a valid worktree or the repo root to continue:\n $ cd ${root}\n\n`,
			);
		}
	}
	return root;
}
