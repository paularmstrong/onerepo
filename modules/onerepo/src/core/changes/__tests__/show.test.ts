import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import * as show from '../show';

const graph = getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = getCommand(show, graph);

describe('show changes', () => {
	test('adds change files', async () => {
		vi.spyOn(process.stdout, 'write').mockReturnValue(true);
		await run('-w tacos --format json');

		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringContaining(
				'{"cheese":{"type":"minor","version":"2.1.0","entries":[{"type":"minor","content":"A minor change\\n"',
			),
		);
	});
});
