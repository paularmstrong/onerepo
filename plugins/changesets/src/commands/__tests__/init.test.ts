import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import * as Init from '../init';
import { getCommand } from '@onerepo/test-cli';

jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

const { run } = getCommand(Init);

describe('handler', () => {
	beforeEach(async () => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('Initializes changeset', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(file, 'exists').mockResolvedValue(false);
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(expect.objectContaining({ cmd: 'npx', args: ['changeset', 'init'] }));
	});

	test('Does not re-initialize', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npx', args: ['changeset', 'init'] })
		);
	});
});
