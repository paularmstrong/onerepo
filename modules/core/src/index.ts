import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lstat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { register } from 'esbuild-register/dist/node';
import { globSync } from 'glob';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import createYargs from 'yargs/yargs';
import { getGraph } from '@onerepo/graph';
import { destroyLogger } from '@onerepo/logger';
import type { RequireDirectoryOptions, Argv as Yargv } from 'yargs';
import type { Argv, DefaultArgv, HandlerExtra, Yargs } from '@onerepo/yargs';
import { workspaceBuilder } from './workspaces';
import { docgen as docgenPlugin } from './core/docgen';
import { generate as generatePlugin } from './core/generate';
import { graph as graphPlugin } from './core/graph';
import { install as installPlugin } from './core/install';
import { tasks as tasksPlugin } from './core/tasks';
import { measure } from './performance';
import type { Config, PluginObject } from './types';

export type { GraphSchemaValidators } from './core/graph';
export * from './types';

const defaultConfig: Required<Config> = {
	core: {},
	description: 'oneRepo’s very own `one` CLI.',
	head: 'main',
	ignoreCommands: /(\/__\w+__\/|\.test\.|\.spec\.)/,
	measurePerformance: true,
	name: 'one',
	plugins: [],
	root: process.cwd(),
	subcommandDir: 'commands',
};

/**
 * @group Core
 */
export interface AppRunResult {
	performanceResults: string | null;
}

/**
 * Command-line application returned from {@link setup | `setup()`}.
 *
 * @example
 * ```js
 * setup().then(({ run }) => run());
 * ```
 * @group Core
 */
export type App = {
	/**
	 * (advanced) Further extend the yargs object before running the command handler. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more information.
	 */
	yargs: Yargs;
	/**
	 * Run the command handler.
	 */
	run: () => Promise<AppRunResult>;
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
 * @group Core
 */
export async function setup(
	/**
	 * CLI configuration
	 */
	config: Config = {},
	/**
	 * @internal
	 * Override the initial yargs instance. Really only useful for dependency-injection during unit test
	 */
	yargsInstance: Yargv = createYargs(process.argv.slice(2)),
): Promise<App> {
	register({});
	performance.mark('onerepo_start_Program');

	const resolvedConfig = { ...defaultConfig, ...config };
	const { core, description, head, ignoreCommands, measurePerformance, name, plugins, subcommandDir, root } =
		resolvedConfig;

	process.env.ONE_REPO_ROOT = getActualRoot(root);
	process.env.ONE_REPO_HEAD_BRANCH = head;
	process.env.ONE_REPO_DRY_RUN = 'false';
	process.env.ONE_REPO_VERBOSITY = '0';

	const yargs = setupYargs(yargsInstance.scriptName(name)).epilogue(description);
	yargs.completion(`${name}-completion`, false);

	const graph = await getGraph(process.env.ONE_REPO_ROOT);

	const pre: Array<NonNullable<PluginObject['preHandler']>> = [];
	async function preHandler(argv: Argv<DefaultArgv>, extra: HandlerExtra) {
		await Promise.all(pre.map((fn) => fn(argv, extra)));
	}
	const post: Array<NonNullable<PluginObject['postHandler']>> = [];
	async function postHandler(argv: Argv<DefaultArgv>, extra: HandlerExtra) {
		await Promise.all(post.map((fn) => fn(argv, extra)));
	}

	const options = commandDirOptions({
		graph,
		exclude: ignoreCommands,
		preHandler,
		postHandler,
	});

	yargs.commandDir = patchCommandDir(options, yargs.commandDir);
	// TODO: find a better way
	// more hacks - the patch function doesn't work with plugin-docgen
	if ('_commandDirOpts' in yargs) {
		yargs._commandDirOpts = options;
	}

	// Install the core plugins
	if (core.docgen !== false) {
		plugins.push(docgenPlugin(core.docgen, setup, config));
	}
	if (core.generate !== false) {
		plugins.push(generatePlugin(core.generate));
	}
	if (core.graph !== false) {
		plugins.push(graphPlugin(core.graph));
	}
	if (core.install !== false) {
		plugins.push(installPlugin(core.install));
	}
	if (core.tasks !== false) {
		plugins.push(tasksPlugin(core.tasks));
	}

	// Other plugins
	for (const plugin of plugins) {
		const {
			yargs: pluginYargs,
			preHandler,
			postHandler,
		} = typeof plugin === 'function' ? plugin(resolvedConfig) : plugin;
		if (typeof pluginYargs === 'function') {
			pluginYargs(yargs, options.visit);
		}
		if (typeof preHandler === 'function') {
			pre.push(preHandler);
		}
		if (typeof postHandler === 'function') {
			post.push(postHandler);
		}
	}

	// Local commands
	if (subcommandDir !== false) {
		const rootCommandPath = path.join(process.env.ONE_REPO_ROOT, subcommandDir);
		if (existsSync(rootCommandPath)) {
			const stat = await lstat(rootCommandPath);
			if (stat.isDirectory()) {
				yargs.commandDir(rootCommandPath);
			}
		}

		// Workspace commands using subcommandDir
		if (core.graph !== false) {
			yargs.command({
				describe: 'Run workspace-specific commands',
				command: '$0',
				aliases: ['workspace', 'ws'],
				builder: workspaceBuilder(graph, subcommandDir || 'commands'),
				// This handler is a no-op because the builder demands N+1 command(s) be input
				handler: () => {},
			});
		}
	}

	return {
		yargs,
		run: async () => {
			const argv = await yargs.parse();

			performance.mark('onerepo_end_Program', {
				detail:
					'The measure of time from the beginning of parsing program setup and CLI arguments through the end of the handler & any postHandler options.',
			});

			const performanceResults = await measure(measurePerformance, argv);

			destroyLogger();

			return {
				performanceResults,
			} satisfies AppRunResult;
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
	options: RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> },
	commandDir: Yargs['commandDir'],
) {
	const require = createRequire('/');
	return function (this: Yargs, pathname: string) {
		const files = globSync(
			`${pathname}${options.recurse ? '/**' : ''}/*${options.extensions ? `.{${options.extensions.join(',')}}` : ''}`,
			{
				nodir: true,
			},
		);
		this.commandDir = patchCommandDir(options, commandDir);

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
	if (rel.includes('..')) {
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
		} catch (e) {
			throw new Error(
				`\nPlease change your working directory to a valid worktree or the repo root to continue:\n $ cd ${root}\n\n`,
			);
		}
	}
	return root;
}
