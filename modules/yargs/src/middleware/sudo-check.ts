import type { Logger } from '@onerepo/logger';
import type { Argv as Yargv } from 'yargs';

export function sudoCheckMiddleware(yargs: Yargv, logger: Logger) {
	return async function sudoCheckMiddleware() {
		if (!process.env.SUDO_UID) {
			return;
		}

		logger.error(`\u0000
Do not run commands with sudo!

If elevated permissions are required, commands will prompt you for your password only if and when necessary.
\u0000`);
		await logger.end();
		yargs.exit(1, new Error());
	};
}
