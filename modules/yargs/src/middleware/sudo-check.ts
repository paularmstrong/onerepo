import type { Argv } from 'yargs';
import { logger } from '@onerepo/logger';

export const sudoCheckMiddleware = (yargs: Argv) =>
	function sudoCheckMiddleware() {
		if (process.env.SUDO_UID) {
			yargs.showHelp();
			const msg =
				'Do not run commands with `sudo`! If elevated permissions are required, commands will prompt you for your password only if and when necessary.';
			logger.error(msg);
			yargs.exit(1, new Error(msg));
		}
	};
