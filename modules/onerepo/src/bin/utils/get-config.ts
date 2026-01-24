import path from 'node:path';
import { glob } from 'node:fs/promises';
import type { RootConfig } from '../../types/index.ts';

/**
 * Gets the configuration file and dirname of the file starting at the process.cwd() and working upward until hitting the root of the filesystem.
 * If not found, will return undefined.
 */
export async function getConfig(cwd: string = process.cwd()) {
	// Find a root config starting at the current working directory, looking upward toward filesystem root
	let configRoot = cwd;
	let config: RootConfig | undefined;
	let lastKnownPossibleRoot: string | undefined;
	findRoot: while (configRoot && configRoot !== '/') {
		try {
			const foundFiles = glob('onerepo.config.{ts,js,mjs,cjs,cts}', { cwd: configRoot });
			for await (const file of foundFiles) {
				config = (await import(path.join(configRoot, file)))?.default;
				if (config?.root) {
					break findRoot;
				}
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
