#!/usr/bin/env node
import path from 'node:path';
import { createRequire } from 'node:module';
import createYargs from 'yargs/yargs';
import initJiti from 'jiti';
import { Graph } from '@onerepo/graph';
import { internalSetup, noRepoPlugins } from '..';
import type { setup as Setup } from '../setup';

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

const cwd = process.cwd();
const jiti = initJiti(cwd, { interopDefault: true });

// Find a root config starting at the current working directory, looking upward toward filesystem root
let curPath = cwd;
let config;
while (curPath && curPath !== '/') {
	try {
		const { default: conf } = jiti(path.join(curPath, `onerepo.config`));
		config = conf;
		if (config.root) {
			break;
		}
		curPath = path.dirname(curPath);
		config = undefined;
	} catch (e) {
		curPath = path.dirname(curPath);
		config = undefined;
	}
}

if (!config) {
	config = { root: true };
}

let app: ReturnType<typeof Setup>;
try {
	// Use the cwd-local version of onerepo, if it exists
	const { setup } = jiti('onerepo');
	app = setup(curPath, config);
} catch (e) {
	// fall back on this binary's pre-built version
	const root = path.join(`${process.env.HOME}`, '.onerepo');
	const require = createRequire(process.cwd());
	app = internalSetup({
		require,
		root,
		graph: new Graph(root, { name: 'onerepo-bin', private: true }, [], jiti),
		config: {
			...config,
			plugins: Object.values(noRepoPlugins).map((plugin) => (plugin as () => void)()),
		},
		yargs: createYargs(process.argv.slice(2), process.cwd(), require),
		corePlugins: [],
	});
}

app.then(({ run }) => run());
