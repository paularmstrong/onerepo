import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { getLogger } from '@onerepo/logger';
import { getGraph } from '@onerepo/graph';
import { StagingWorkflow } from '../workflow';

const graph = getGraph(__dirname);

describe('StagingWorkflow', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(file, 'exists').mockResolvedValue(false);
		vi.spyOn(file, 'read').mockResolvedValue('');
		vi.spyOn(file, 'remove').mockResolvedValue(undefined);
		vi.spyOn(file, 'write').mockResolvedValue(undefined);
	});

	describe('saveUnstaged', () => {
		test('checks status', async () => {
			const logger = getLogger({ verbosity: 0 });
			const workflow = new StagingWorkflow({ graph, logger });

			await workflow.saveUnstaged();

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'git',
					args: ['status', '-z'],
				}),
			);
		});

		test.todo('Actually write tests for this cumbersome process');
	});
});
