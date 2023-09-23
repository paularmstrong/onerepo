import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as file from '@onerepo/file';
import { getCommand } from '@onerepo/test-cli';
import * as Init from '../init';

const { graph, run } = getCommand(Init);

describe('handler', () => {
	beforeEach(async () => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
	});

	test('Initializes changeset', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(file, 'exists').mockResolvedValue(false);
		await run('', { graph });

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'changeset', args: ['init'] }),
		);
	});

	test('Does not re-initialize', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('', { graph });

		expect(graph.packageManager.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'changeset', args: ['init'] }),
		);
	});
});
