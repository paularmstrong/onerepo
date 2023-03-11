import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as Verify from './verify';
import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Verify);

describe('verify', () => {
	test('can verify the graph', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await expect(run('', { graph })).resolves.toBeUndefined();
	});

	test('can verify cjson (eg tsconfigs)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/tsconfig-schema.ts');
		await expect(run(`--custom-schema ${schema}`, { graph })).resolves.toBeUndefined();
	});
});
