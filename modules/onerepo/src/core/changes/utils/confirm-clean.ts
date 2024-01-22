import inquirer from 'inquirer';
import { isClean } from '@onerepo/git';
import type { LogStep } from '@onerepo/logger';
import { getLogger, stepWrapper } from '@onerepo/logger';

export async function confirmClean(options: { step?: LogStep } = {}) {
	return stepWrapper({ name: 'Confirm working state', step: options.step }, async (step) => {
		const logger = getLogger();
		if (!(await isClean({ step }))) {
			logger.pause();
			const { okay } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'okay',
					message: 'Current work tree has modifications or untracked files. Do you wish to continue?',
					default: false,
				},
			]);
			logger.unpause();

			if (okay) {
				step.warn('Current work tree has modifications or untracked files. Continuing as marked_okay.');
			}
			return okay;
		}
		return true;
	});
}
