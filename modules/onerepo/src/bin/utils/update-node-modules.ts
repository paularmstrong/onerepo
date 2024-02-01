import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { getLockfile, getLogger, Graph, file } from '../..';

/**
 * Attempt to run the `install` command for the local package manager.
 * Bypass with env vars CI and ONEREPO_USE_HOOKS="0"
 */
export async function updateNodeModules(configRoot: string, require: NodeRequire) {
	// Don't do this in CI or if the user does not like things auto-running
	if (process.env.CI || process.env.ONEREPO_USE_HOOKS === '0') {
		return;
	}

	const lockfile = getLockfile(configRoot);

	if (!lockfile) {
		return;
	}

	performance.mark('onerepo_start_check_modules_cache');
	// Create a hash of the lockfile full path and use that as the cache name
	// This should never change – if it does, it will be good to create a new cache file
	const cacheFile = path.join(__dirname, '.cache', getHash(lockfile));

	const cachedHash = existsSync(cacheFile) ? readFileSync(cacheFile, 'utf8') : '';
	const currentHash = getHash(readFileSync(lockfile, 'utf8'));

	if (currentHash !== cachedHash) {
		// Create a logger so when there's feedback when we run the install
		// But start it silenced, just in case.
		const logger = getLogger({ verbosity: 0 });
		const tempGraph = new Graph(configRoot, { name: 'onerepo-bin', private: true }, [], require);
		process.env.ONEREPO_ROOT = configRoot;

		// Increase the logger verbosity and run install
		logger.verbosity = 1;
		await tempGraph.packageManager.install();
		logger.verbosity = 0;

		// Back to silent, write out the hash of the lockfile to a cache for next time
		await file.write(cacheFile, currentHash);
		// End the logger and pop it off the global stack
		// A new logger will be created when `setup()` is run
		await logger.end();
	}
	performance.mark('onerepo_end_check_modules_cache');
}

/**
 * Shortcut to create a hash of a string
 */
function getHash(contents: string) {
	return createHash('sha1').update(contents).digest('hex');
}
