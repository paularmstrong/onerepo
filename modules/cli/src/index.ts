import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { commandDirOptions, setupYargs } from './yargs';
import type { Yargs } from './yargs';
import { existsSync } from 'fs';
import createYargs from 'yargs/yargs';
import { getGraph } from '@onerepo/graph';
import type { Repository, Workspace } from '@onerepo/graph';
import type { RequireDirectoryOptions } from 'yargs';

export * from './builders';
export * from './logger';
export * from './functions';
export * from './yargs';

type PluginObject = {
	commandDir?: string;
	yargs?: (yargs: Yargs, visitor: NonNullable<RequireDirectoryOptions['visit']>) => Yargs;
};
export type Plugin = PluginObject | ((config: Config) => PluginObject);

export interface Config {
	// todo: make type safe
	core?: Record<string, Record<string, unknown>>;
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
	subcommandDir?: string;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			ONE_REPO_ROOT: string;
			ONE_REPO_DRY_RUN: string;
			ONE_REPO_CI: string;
			ONE_REPO_VERBOSITY: string;
			ONE_REPO_HEAD_BRANCH: string;
		}
	}
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

const corePlugins = ['@onerepo/plugin-tasks', '@onerepo/plugin-install'];

export async function setup(config: Config = {}) {
	performance.mark('one_startup');
	const resolvedConfig = { ...defaultConfig, ...config };
	const { name, core, head, plugins, subcommandDir, root, ignoreCommands } = resolvedConfig;

	process.env.ONE_REPO_ROOT = root;
	process.env.ONE_REPO_HEAD_BRANCH = head;

	const yargs = setupYargs(createYargs(process.argv.slice(2)).scriptName(name));

	const graph = await getGraph(root);
	const options = commandDirOptions(graph, ignoreCommands);

	yargs.commandDir = patchCommandDir(options, yargs.commandDir);

	for (const pluginName of corePlugins) {
		const name = pluginName.replace('@onerepo/plugin-', '');
		const { [name]: plugin } = require(pluginName);
		plugins.unshift(plugin(core[name]));
	}

	for (const plugin of plugins) {
		const { yargs: pluginYargs } = typeof plugin === 'function' ? plugin(resolvedConfig) : plugin;
		if (typeof pluginYargs === 'function') {
			pluginYargs(yargs, options.visit);
		}
	}

	yargs
		.commandDir(path.join(__dirname, 'commands'))
		.commandDir(path.join(root, subcommandDir))
		.command({
			describe: 'Run workspace-specific commands',
			command: '$0',
			aliases: ['workspace', 'ws'],
			builder: workspaceBuilder(graph, subcommandDir, name),
			// This handler is a no-op because the builder demands N+1 command(s) be input
			handler: () => {},
		});

	return {
		yargs,
		run: async () => yargs.argv,
	};
}

function workspaceBuilder(graph: Repository, dirname: string, scriptName: string) {
	return (yargs: Yargs) => {
		yargs
			.usage(`${scriptName} workspace <name> <command> [options]`)
			.usage(`${scriptName} ws <name> <command> [options]`)
			.epilogue(
				`Add commands to the \`${dirname}\` directory within a workspace to create workspace-specific commands.`
			);

		const workspaceName = process.argv[3];
		if (graph.getByName(workspaceName)) {
			const ws = graph.getByName(workspaceName)!;
			addWorkspace(yargs, ws, dirname);
			return yargs.demandCommand(1, `Please enter a command to run in ${ws.name}.`);
		}

		// Allow omitting the workspace name if the process working directory is already in a workspace
		const workingWorkspace = graph.getByLocation(process.cwd());
		if (workingWorkspace && workingWorkspace !== graph.root) {
			yargs
				.usage(`${scriptName} workspace <command> [options]`)
				.usage(`${scriptName} ws <command> [options]`)
				.epilogue(
					`You are currently working in the ${workingWorkspace.name} workspace, so workspace-specific commands will be run by default when a suitable name or alias for this workspace is omitted.`
				);
			return addCommandDir(yargs, workingWorkspace, dirname).demandCommand(
				2,
				`Please enter a valid command for the ${workingWorkspace.name} workspace or enter the name of another workspace for more choices.`
			);
		}

		graph.dependencies().forEach((name: string) => {
			const ws = graph.getByName(name)!;
			if (ws.isRoot) {
				return;
			}
			if (existsSync(ws.resolve(dirname))) {
				addWorkspace(yargs, ws, dirname);
			}
		});
		return yargs.demandCommand(1, 'Please enter a workspace name from the list above.');
	};
}

function addWorkspace(yargs: Yargs, ws: Workspace, dirname: string): Yargs {
	const wsNames = [ws.name, ...ws.aliases];

	return yargs.command(wsNames, `Runs commands in the \`${ws.name}\` workspace`, (yargs: Yargs) => {
		return addCommandDir(yargs, ws, dirname);
	});
}

function addCommandDir(yargs: Yargs, ws: Workspace, dirname: string): Yargs {
	return yargs
		.commandDir(ws.resolve(dirname))
		.demandCommand(1, `Please enter a valid command for the ${ws.name} workspace.`);
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
