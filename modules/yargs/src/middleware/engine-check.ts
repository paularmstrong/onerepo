import { intersects } from 'semver';
import type { Graph } from '@onerepo/graph';
import type { Logger } from '@onerepo/logger';
import type { Argv as Yargv } from 'yargs';
import type { Argv } from '@onerepo/yargs';

export function checkEnginesMiddleware(yargs: Yargv, graph: Graph, logger: Logger) {
	return async function checkEnginesMiddleware(argv: Omit<Argv, '--'>) {
		if (argv['skip-engine-check']) {
			return;
		}

		const supportedRange = graph.root.packageJson.engines?.node;
		if (!supportedRange) {
			return;
		}

		const currentVersion = process.versions.node;
		if (intersects(currentVersion, supportedRange)) {
			return;
		}

		logger.error(`\u0000
Node.js version mismatch.

Expected curren version ("${currentVersion}") to intersect "${supportedRange}".

Install a version matching "${supportedRange}" or bypass this check by passing "--skip-engine-check".
\u0000`);
		await logger.end();
		yargs.exit(1, new Error());
	};
}
