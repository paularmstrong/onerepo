import { getLogger } from '@onerepo/logger';
import { eq, gt, lt } from 'semver';
import type { Plugin } from '../../types';
import pkg from '../../../package.json';
import * as cmd from './install';

export const install: Plugin = function install() {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) => builder(yargs).usage(`$0 ${command} [options...]`),
				handler,
			);
		},

		shutdown: async () => {
			const sym = Symbol.for('onerepo_installed_version');
			if (!(sym in globalThis)) {
				return;
			}

			const localVersion = pkg.version;
			// @ts-ignore
			const installedVersion = globalThis[sym] as string;

			if (eq(installedVersion, localVersion)) {
				return;
			}

			const logger = getLogger();
			const oVerbosity = logger.verbosity;
			logger.verbosity = 2;
			const step = logger.createStep('Version mismatch detected!');

			const bar = '⎯'.repeat(Math.min(process.stderr.columns, 70));
			if (
				// @ts-ignore
				gt(installedVersion, localVersion)
			) {
				step.warn(`${bar}
Globally installed version of the oneRepo CLI (${installedVersion})
is newer than the version in this monorepo (${localVersion}).

For the optimal experience, update your local dependency to
${installedVersion} or newer.
${bar}`);
			}

			if (lt(installedVersion, localVersion)) {
				step.warn(`${bar}
Globally installed version of the oneRepo CLI (${installedVersion})
is older than the local version in this monorepo (${localVersion}).

For the optimal experience, update the global version by re-installing:
${bar}

  $ one install

${bar}`);
			}
			await step.end();
			logger.verbosity = oVerbosity;
		},
	};
};
