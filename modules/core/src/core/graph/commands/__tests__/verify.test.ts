import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import { getCommand } from '@onerepo/test-cli';
import * as Verify from '../verify';

const { run } = getCommand(Verify);

describe('verify', () => {
	let runId: string | undefined;
	beforeEach(() => {
		runId = process.env.GITHUB_RUN_ID;
		delete process.env.GITHUB_RUN_ID;
	});

	afterEach(() => {
		if (runId) {
			process.env.GITHUB_RUN_ID = runId;
		}
	});

	test('can turn off graph dependency verification', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('--dependencies off', { graph })).resolves.toBeTruthy();
	});

	test('can verify the graph dependencies', async () => {
		const graphProd = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('--dependencies loose', { graph: graphProd })).rejects.toMatch(
			'Version mismatches found in "menu"',
		);

		const graphDev = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo-dev'));

		await expect(run('--dependencies loose', { graph: graphDev })).rejects.toMatch(
			'Version mismatches found in "menu"',
		);
	});

	// vitest is failing to be able to use `require` from `createRequire`
	test.skip('can verify cjson (eg tsconfigs)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/tsconfig-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch('must be equal to constant');
	});

	test.skip('can verify js (eg jest.config, etc)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/js-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch(
			"must have required property 'displayName'",
		);
	});

	test.skip('can verify yaml files', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/yaml-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch('must be equal to constant');
	});

	test.skip('can validate with functions', async () => {
		const schema = require.resolve('./__fixtures__/functional-schema.ts');
		const goodGraph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await expect(run(`--custom-schema ${schema}`, { graph: goodGraph })).resolves.toBeTruthy();

		const badGraph = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run(`--custom-schema ${schema}`, { graph: badGraph })).rejects.toMatch(
			"must have required property 'repository'",
		);
	});
});
