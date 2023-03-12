import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lstat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { globSync } from 'glob';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import type { Argv, DefaultArgv, HandlerExtra, Yargs } from '@onerepo/yargs';
import createYargs from 'yargs';
import { getGraph } from '@onerepo/graph';
import type { RequireDirectoryOptions } from 'yargs';
import { workspaceBuilder } from './workspaces';
import { generate as generatePlugin } from './core/generate';
import { graph as graphPlugin } from './core/graph';
import { install as installPlugin } from './core/install';
import { tasks as tasksPlugin } from './core/tasks';
import type { Config, PluginObject } from './types';

export type { GraphSchemaValidators } from './core/graph';
export * from './types';

// NB: process.env vars can ONLY be strings
process.env.ONE_REPO_ROOT = process.cwd();
process.env.ONE_REPO_DRY_RUN = process.env.ONE_REPO_DRY_RUN ?? 'false';
process.env.ONE_REPO_VERBOSITY = process.env.ONE_REPO_VERBOSITY ?? '0';
process.env.ONE_REPO_HEAD_BRANCH = process.env.ONE_REPO_HEAD_BRANCH ?? 'main';

const defaultConfig: Required<Config> = {
	name: 'one',
	head: 'main',
	core: {},
	plugins: [],
	subcommandDir: 'commands',
	root: process.cwd(),
	ignoreCommands: /(\/__\w+__\/|\.test\.|\.spec\.)/,
	description: 'oneRepo’s very own `one` CLI.',
};

/**
 * Command-line application returned from setup
 *
 * ```js
 * const setup().then(({ run }) => run());
 * ```
 * @group Core
 */
export type App = {
	/**
	 * (advanced) Further extend the yargs object before running the command handler.
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
 * @group Core
 */
export async function setup(config: Config = {}): Promise<App> {
	performance.mark('one_startup');
	const resolvedConfig = { ...defaultConfig, ...config };
	const { description, name, core, head, plugins, subcommandDir, root, ignoreCommands } = resolvedConfig;

	process.env.ONE_REPO_ROOT = getActualRoot(root);
	process.env.ONE_REPO_HEAD_BRANCH = head;

	const yargs = setupYargs(createYargs(process.argv.slice(2)).scriptName(name)).epilogue(description);
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

	const options = commandDirOptions({ graph, exclude: ignoreCommands, preHandler, postHandler });

	yargs.commandDir = patchCommandDir(options, yargs.commandDir);
	// TODO: find a better way
	// more hacks - the patch function doesn't work with plugin-docgen
	if ('_commandDirOpts' in yargs) {
		yargs._commandDirOpts = options;
	}

	// Install the core plugins
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
			yargs.argv;
		},
	};
}

/**
 * Recursively patch the yarg's instance `commandDir` to ensure our options are always set.
 * This ensures things like the include/exclude are set, but more importantly that the command handler is enclosed with async handling for logging purposes.
 *
 * Ideally we would use something safer like a Proxy, but basically all of yargs is internal private, which fails. There's a long discussion about this, but tl;dr: too bad.
 * https://github.com/tc39/proposal-class-fields/issues/106
 */
function patchCommandDir(
	options: RequireDirectoryOptions & { visit: NonNullable<RequireDirectoryOptions['visit']> },
	commandDir: Yargs['commandDir']
) {
	const require = createRequire('/');
	return function (this: Yargs, pathname: string) {
		const files = globSync(`${pathname}/*`, { nodir: true });
		this.commandDir = patchCommandDir(options, commandDir);
		for (const file of files) {
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
				`\nPlease change your working directory to a valid worktree or the repo root to continue:\n $ cd ${root}\n\n`
			);
		}
	}
	return root;
}
