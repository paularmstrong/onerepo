import { getLogger } from '@onerepo/logger';
import type { Argv } from '@onerepo/yargs';

export function setEnvironmentMiddleware(argv: Omit<Argv, '--'>) {
	process.env.ONE_REPO_DRY_RUN = `${argv['dry-run']}`;
	argv.verbosity = argv.silent ? 0 : argv.verbosity;
	process.env.ONE_REPO_VERBOSITY = `${argv.verbosity}`;
	getLogger().verbosity = argv.verbosity;
}
