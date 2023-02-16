import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import type { Yargs } from '@onerepo/types';
import createYargs from 'yargs/yargs';
import { getGraph } from '@onerepo/graph';
import type { RequireDirectoryOptions } from 'yargs';
import { workspaceBuilder } from './workspaces';
import type { Options as GraphOptions } from '@onerepo/plugin-graph';
import type { Options as InstallOptions } from '@onerepo/plugin-install';
import type { Options as TasksOptions } from '@onerepo/plugin-tasks';

type PluginObject = {
	commandDir?: string;
	yargs?: (yargs: Yargs, visitor: NonNullable<RequireDirectoryOptions['visit']>) => Yargs;
};
export type Plugin = PluginObject | ((config: Config) => PluginObject);

export interface Config {
	/**
	 * Core plugin configuration. These plugins will be added automatically unless the value specified is `false`
	 */
	core?: {
		graph?: GraphOptions | false;
		install?: InstallOptions | false;
		tasks?: TasksOptions | false;
	};
	/**
	 * What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.
	 */
	head?: string;
	/**
	 * When using subcommandDir, include a regular expression here to ignore files. By default, we will try to override *.(test|spec).* files and maybe some more. This will override the default.
	 */
	ignoreCommands?: RegExp;
	/**
	 * When you ask for --help at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…
	 */
	description?: string;
	/**
	 * Give your CLI a unique name that's short and easy to remember.
	 * If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?
	 */
	name?: string;
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
process.env.ONE_REPO_CI = process.env.ONE_REPO_CI ?? 'false';
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

const corePlugins = ['@onerepo/plugin-tasks', '@onerepo/plugin-install', '@onerepo/plugin-graph'];

export async function setup(config: Config = {}) {
	performance.mark('one_startup');
	const resolvedConfig = { ...defaultConfig, ...config };
	const { description, name, core, head, plugins, subcommandDir, root, ignoreCommands } = resolvedConfig;

	process.env.ONE_REPO_ROOT = getActualRoot(root);
	process.env.ONE_REPO_HEAD_BRANCH = head;

	const yargs = setupYargs(createYargs(process.argv.slice(2)).scriptName(name)).epilogue(description);

	const graph = await getGraph(process.env.ONE_REPO_ROOT);
	const options = commandDirOptions(graph, ignoreCommands);

	yargs.commandDir = patchCommandDir(options, yargs.commandDir);
	// TODO: find a better way
	// more hacks - the patch function doesn't work with plugin-docgen
	if ('_commandDirOpts' in yargs) {
		yargs._commandDirOpts = options;
	}

	for (const pluginName of corePlugins) {
		const name = pluginName.replace('@onerepo/plugin-', '') as keyof Config['core'];
		if (core[name] !== false) {
			const { [name]: plugin } = require(pluginName);
			plugins.unshift(plugin(core[name]));
		}
	}

	for (const plugin of plugins) {
		const { yargs: pluginYargs } = typeof plugin === 'function' ? plugin(resolvedConfig) : plugin;
		if (typeof pluginYargs === 'function') {
			pluginYargs(yargs, options.visit);
		}
	}

	if (subcommandDir !== false) {
		yargs.commandDir(path.join(process.env.ONE_REPO_ROOT, subcommandDir));
	}

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

	return {
		yargs,
		run: async () => yargs.argv,
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
