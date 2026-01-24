import path from 'node:path';
import * as humanId from 'human-id';
import { getGraph } from '@onerepo/graph';
import { getFilename } from '../filename.ts';

const graph = await getGraph(path.join(__dirname, '../../__tests__/__fixtures__/with-entries'));

describe('getFilename', () => {
	test('generates a hash from the content and date', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1706903142100);

		await expect(getFilename(graph, 'tacos', 'hash')).resolves.toEqual('a5f1b372');

		vi.spyOn(Date, 'now').mockReturnValue(1706903168043);

		await expect(getFilename(graph, 'tacos', 'hash')).resolves.toEqual('c00303e8');
	});

	test('generates using human-id', async () => {
		vi.spyOn(humanId, 'humanId').mockReturnValue('modern-clouds-camp');
		await expect(getFilename(graph, 'tacos', 'human')).resolves.toEqual('modern-clouds-camp');
	});

	test('returns a hash if human-id fails', async () => {
		vi.spyOn(humanId, 'humanId').mockImplementation(() => {
			throw new Error();
		});
		vi.spyOn(Date, 'now').mockReturnValue(1706903168043);

		await expect(getFilename(graph, 'tacos', 'human')).resolves.toEqual('c00303e8');
	});
});
