import * as subprocess from '@onerepo/subprocess';
import { getCommand } from '@onerepo/test-cli';
import * as command from '../typescript';

const { run } = getCommand(command);

jest.mock('@onerepo/subprocess');

describe('handler', () => {
	test('includes --pretty', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		await run('-a');

		expect(subprocess.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'npx',
					args: ['tsc', '-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--pretty'],
				}),
			]),
		);
	});

	test('can turn off --pretty', async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		await run('-a --no-pretty');

		expect(subprocess.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'npx',
					args: ['tsc', '-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--no-pretty'],
				}),
			]),
		);
	});
});
