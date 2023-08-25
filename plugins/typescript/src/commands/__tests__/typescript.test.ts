import { getCommand } from '@onerepo/test-cli';
import * as command from '../typescript';

const { graph, run } = getCommand(command);

describe('handler', () => {
	test('includes --pretty', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		await run('-a');

		expect(graph.packageManager.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: ['-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--pretty'],
				}),
			]),
		);
	});

	test('can turn off --pretty', async () => {
		jest.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		jest.spyOn(graph.packageManager, 'batch').mockResolvedValue([['', '']]);
		await run('-a --no-pretty');

		expect(graph.packageManager.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: ['-p', expect.stringMatching('tsconfig.json'), '--noEmit', '--no-pretty'],
				}),
			]),
		);
	});
});
