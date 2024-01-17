import type { Verbosity } from '@onerepo/logger';
import { getLogger } from '@onerepo/logger';
import type { Argv } from '@onerepo/yargs';

export function setEnvironmentMiddleware(argv: Omit<Argv, '--'>) {
	process.env.ONEREPO_DRY_RUN = `${argv['dry-run']}`;
	argv.verbosity = argv.silent ? 0 : argv.verbosity;
	getLogger().verbosity = argv.verbosity as Verbosity;
}
