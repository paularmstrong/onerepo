import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import * as Verify from '../verify';

const { run } = getCommand(Verify);

describe('verify', () => {
	test('can turn off graph dependency verification', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));
		await expect(run('--dependencies off', { graph })).resolves.toBeUndefined();
	});

	test('can verify the graph dependencies', async () => {
		const graphProd = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));
		await expect(run('--dependencies loose', { graph: graphProd })).rejects.toBeUndefined();

		const graphDev = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo-dev'));
		await expect(run('--dependencies loose', { graph: graphDev })).rejects.toBeUndefined();
	});

	test('can verify cjson (eg tsconfigs)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/tsconfig-schema.ts');
		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toEqual(new Error('must be equal to constant'));
	});

	test('can verify js (eg jest.config, etc)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/js-schema.ts');
		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toEqual(
			new Error("must have required property 'displayName'")
		);
	});

	test('can verify yaml files', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/yaml-schema.ts');
		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toEqual(new Error('must be equal to constant'));
	});
});
