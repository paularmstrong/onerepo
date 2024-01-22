import inquirer from 'inquirer';
import * as git from '@onerepo/git';
import { confirmClean } from '../confirm-clean';

describe('confirmClean', () => {
	describe('when not clean', () => {
		beforeEach(() => {
			vi.spyOn(git, 'isClean').mockResolvedValue(false);
		});

		test('returns false from prompt', async () => {
			vi.spyOn(inquirer, 'prompt').mockResolvedValue({ okay: false });

			await expect(confirmClean()).resolves.toBe(false);
			expect(inquirer.prompt).toHaveBeenCalled();
		});

		test('returns true from prompt', async () => {
			vi.spyOn(inquirer, 'prompt').mockResolvedValue({ okay: true });

			await expect(confirmClean()).resolves.toBe(true);
			expect(inquirer.prompt).toHaveBeenCalled();
		});
	});

	describe('when clean', () => {
		beforeEach(() => {
			vi.spyOn(git, 'isClean').mockResolvedValue(true);
		});

		test('returns true from prompt', async () => {
			vi.spyOn(inquirer, 'prompt');

			await expect(confirmClean()).resolves.toBe(true);
			expect(inquirer.prompt).not.toHaveBeenCalled();
		});
	});
});
