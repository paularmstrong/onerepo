#!/usr/bin/env node
import path from 'node:path';
import { createRequire } from 'node:module';
import { createJiti } from 'jiti';
import createYargs from 'yargs/yargs';
import { Graph, internalSetup, noRepoPlugins } from '..';
import pkg from '../../package.json';
import { updateNodeModules } from './utils/update-node-modules';
import { getConfig } from './utils/get-config';

// Suppress Node experimental warnings.
const { emitWarning } = process;
process.emitWarning = (warning, ...args) => {
	if (args[0] === 'ExperimentalWarning') {
		return;
	}

	if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
		return;
	}

	// @ts-ignore
	emitWarning(warning, ...args);
};

// @ts-ignore cannot use symbol on global in ts
globalThis[Symbol.for('onerepo_installed_version')] = pkg.version;

export const jiti = createJiti(process.cwd(), { interopDefault: true }) as unknown as NodeRequire;

/**
 * Fall back on running `one` in global mode.
 * This enables non-repo functions like `create` and `install`.
 */
async function runGlobal() {
	const root = path.join(`${process.env.HOME}`, '.onerepo');
	const require = createRequire(__filename);
	const { run } = await internalSetup({
		require,
		root,
		graph: new Graph(root, { name: 'onerepo-bin', private: true }, [], require),
		config: {
			// Pretend we're in a root anyway
			root: true,
			// Disable the "workspace" commands
			commands: { directory: false },
			// No plugins
			plugins: [],
		},
		yargs: createYargs(process.argv.slice(2), process.cwd(), require),
		corePlugins: noRepoPlugins,
	});

	return run();
}

/**
 * Run oneRepo, hopefully finding a monorepo in the cwd
 */
async function getSetupAndRun() {
	const { config, configRoot } = getConfig(jiti, process.cwd());

	if (configRoot === '/' || !config) {
		return runGlobal();
	}

	let setup;
	try {
		setup = jiti('onerepo').setup;
	} catch (e) {
		// @ts-ignore
		if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
			return runGlobal();
		}
		throw e;
	}

	await updateNodeModules(configRoot, jiti);

	// Use the cwd-local version of onerepo, assuming it exists
	const app = setup(configRoot, config).catch((e: unknown) => {
		process.stderr.write(`${'='.repeat(Math.min(process.stderr.columns, 120))}
  Unable to configure oneRepo in your working directory (${configRoot});
	This is likely NOT a bug within oneRepo, but somewhere in the local repository’s commands
	or one of the dependencies within the commands.
  Check your configuration & commands for syntax errors and ensure node_modules are installed.
${'⎯'.repeat(Math.min(process.stderr.columns, 120))}

  ${(e as Error)?.stack?.replace(/\n/g, '\n  ') ?? e?.toString().replace(/\n/g, '\n  ')}

${'='.repeat(Math.min(process.stderr.columns, 120))}`);
		process.exit(1);
	});

	const { run } = await app;
	run();
}

getSetupAndRun();
