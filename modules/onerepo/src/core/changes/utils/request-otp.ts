import inquirer from 'inquirer';
import pc from 'picocolors';
import { getLogger } from '@onerepo/logger';

export async function requestOtp() {
	const logger = getLogger();

	if (!process.stdout.isTTY) {
		throw new Error('Cannot prompt for OTP in a non-TTY environment.');
	}

	logger.pause();
	const { otp } = await inquirer.prompt([
		{
			type: 'password',
			prefix: '🔐',
			message: 'Please enter your OTP',
			name: 'otp',
			validate: (input) => {
				if (!input) {
					return `${pc.bold(pc.red('Error:'))} Please enter a one-time passcode.`;
				}
				return true;
			},
		},
	]);
	logger.unpause();
	return otp as string;
}
