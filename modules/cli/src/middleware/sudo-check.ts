export function sudoCheckMiddleware() {
	if (process.env.SUDO_UID) {
		throw new Error(
			'Do not run commands with `sudo`! If elevated permissions are required, commands will prompt you for your password only if and when necessary.'
		);
	}
}
