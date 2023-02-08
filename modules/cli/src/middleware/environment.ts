import { logger } from '../logger';
import type { Argv } from '../yarg-types';

export function setEnvironmentMiddleware(argv: Omit<Argv, '--'>) {
	process.env.ONE_REPO_DRY_RUN = `${argv['dry-run']}`;
	process.env.ONE_REPO_CI = `${argv.ci}`;
	argv.verbosity = argv.silent ? 0 : argv.verbosity;
	process.env.ONE_REPO_VERBOSITY = `${argv.verbosity}`;
	logger.verbosity = argv.verbosity;
}
