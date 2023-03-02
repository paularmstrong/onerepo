import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lstat } from 'node:fs/promises';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import type { Argv, DefaultArgv, HandlerExtra, Yargs } from '@onerepo/types';
import createYargs from 'yargs';
import { getGraph } from '@onerepo/graph';
import type { RequireDirectoryOptions } from 'yargs';
import { workspaceBuilder } from './workspaces';
import { generate as generatePlugin } from './core/generate';
import { graph as graphPlugin } from './core/graph';
import { install as installPlugin } from './core/install';
import { tasks as tasksPlugin } from './core/tasks';
import type { Options as GenerateOptions } from './core/generate';
import type { Options as GraphOptions } from './core/graph';
import type { Options as InstallOptions } from './core/install';
import type { Options as TasksOptions } from './core/tasks';

export type { GraphSchemaValidators } from './core/graph';

type CoreOptions = {
	generate?: GenerateOptions | false;
	graph?: GraphOptions | false;
	install?: InstallOptions | false;
	tasks?: TasksOptions | false;
};

export type PluginPrePostHandler = (argv: Argv<DefaultArgv>, extra: HandlerExtra) => Promise<void> | void;
type PluginObject = {
	/**
	 * A function that is called with the CLI's `yargs` object and a visitor.
	 * It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the workspace graph, affected list, and much more.
	 */
	yargs?: (yargs: Yargs, visitor: NonNullable<RequireDirectoryOptions['visit']>) => Yargs;
	/**
	 * Run before any command `handler` function is invoked
	 */
	preHandler?: PluginPrePostHandler;
	/**
	 * Run after any command `handler` function is finished
	 */
	postHandler?: PluginPrePostHandler;
};
export type Plugin = PluginObject | ((config: Config) => PluginObject);

/**
 * Setup configuration for the oneRepo command-line interface.
 */
export interface Config {
	/**
	 * Core plugin configuration. These plugins will be added automatically unless the value specified is `false`
	 */
	core?: CoreOptions;
	/**
	 * What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.
	 */
	head?: string;
	/**
	 * When using subcommandDir, include a regular expression here to ignore files. By default, we will try to override *.(test|spec).* files and maybe some more. This will override the default.
	 */
	ignoreCommands?: RegExp;
	/**
	 * When you ask for `--help` at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…
	 */
	description?: string;
	/**
	 * Give your CLI a unique name that's short and easy to remember.
	 * If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?
	 */
	name?: string;
	/**
	 * Add shared commands. https://onerepo.tools/docs/plugins/
	 */
	plugins?: Array<Plugin>;
	/**
	 * Absolute path location to the root of the repository.
	 */
	root?: string;
	/**
	 * A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.
	 */
	subcommandDir?: string | false;
}

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
 */
export interface App {
	/**
	 * (advanced) Further extend the yargs object before running the command handler.
	 */
	yargs: Yargs;
	/**
	 * Run the command handler.
	 */
	run: () => Promise<void>;
}

/**
 * Set up and run your command-line interface.
 *
 * ```js
 * setup({
 * 	name: 'one',
 * 	// ...config
 * }).then(({ run }) => run());
 * ```
 */
export async function setup(config: Config = {}): Promise<App> {
	performance.mark('one_startup');
	const resolvedConfig = { ...defaultConfig, ...config };
	const { description, name, core, head, plugins, subcommandDir, root, ignoreCommands } = resolvedConfig;

	process.env.ONE_REPO_ROOT = getActualRoot(root);
	process.env.ONE_REPO_HEAD_BRANCH = head;

	const yargs = setupYargs(createYargs(process.argv.slice(2)).scriptName(name)).epilogue(description);

	const graph = await getGraph(process.env.ONE_REPO_ROOT);

	const pre: Array<PluginPrePostHandler> = [];
	async function preHandler(argv: Argv<DefaultArgv>, extra: HandlerExtra) {
		await Promise.all(pre.map((fn) => fn(argv, extra)));
	}
	const post: Array<PluginPrePostHandler> = [];
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
function patchCommandDir(options: RequireDirectoryOptions, commandDir: Yargs['commandDir']) {
	return function (this: Yargs, pathname: string, opts: RequireDirectoryOptions = {}) {
		const returnYargs = commandDir.call(this, pathname, { ...options, ...opts });
		returnYargs.commandDir = patchCommandDir(options, returnYargs.commandDir);
		return returnYargs;
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
