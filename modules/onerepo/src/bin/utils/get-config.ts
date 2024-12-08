import path from 'node:path';
import type { RootConfig } from '../../types';

/**
 * Gets the configuration file and dirname of the file starting at the process.cwd() and working upward until hitting the root of the filesystem.
 * If not found, will return undefined.
 */
export function getConfig(require: NodeRequire, cwd: string = process.cwd()) {
	// Find a root config starting at the current working directory, looking upward toward filesystem root
	let configRoot = cwd;
	let config: RootConfig | undefined;
	let lastKnownPossibleRoot: string | undefined;
	while (configRoot && configRoot !== '/') {
		try {
			const { default: conf } = require(path.join(configRoot, `onerepo.config`));
			config = conf;
			if (config?.root) {
				break;
			}
			configRoot = path.dirname(configRoot);
			config = undefined;
		} catch (e) {
			// @ts-ignore
			if (e instanceof Error && e.code === 'MODULE_NOT_FOUND' && !/onerepo\.config['"]/.test(e.message)) {
				lastKnownPossibleRoot = configRoot;
			}
			configRoot = path.dirname(configRoot);
			config = undefined;
		}
	}

	return { config, configRoot: configRoot !== '/' ? configRoot : (lastKnownPossibleRoot ?? configRoot) };
}
