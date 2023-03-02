import path from 'node:path';
import type { Graph } from '@onerepo/graph';
import { getGraph } from '@onerepo/graph';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import * as Init from './init';
import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Init);

describe('handler', () => {
	let graph: Graph;
	beforeEach(async () => {
		graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('Initializes changeset', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(false);
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(expect.objectContaining({ cmd: 'npx', args: ['changeset', 'init'] }));
	});

	test('Does not re-initialize', async () => {
		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npx', args: ['changeset', 'init'] })
		);
	});
});
