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

		await expect(run('--mode off', { graph })).resolves.toBeTruthy();
	});

	test('can verify the graph dependencies', async () => {
		const graphProd = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('--mode loose', { graph: graphProd })).rejects.toMatch('Version mismatches found in "menu"');

		const graphDev = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo-dev'));

		await expect(run('--mode loose', { graph: graphDev })).rejects.toMatch('Version mismatches found in "menu"');
	});

	test('can verify cjson (eg tsconfigs)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/tsconfig-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch('must be equal to constant');
	});

	test('can verify js (eg jest.config, etc)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/js-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch(
			"must have required property 'displayName'",
		);
	});

	test('can verify yaml files', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const schema = require.resolve('./__fixtures__/yaml-schema.ts');

		await expect(run(`--custom-schema ${schema}`, { graph })).rejects.toMatch('must be equal to constant');
	});

	test('can validate with functions', async () => {
		const schema = require.resolve('./__fixtures__/functional-schema.ts');
		const goodGraph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await expect(run(`--custom-schema ${schema}`, { graph: goodGraph })).resolves.toBeTruthy();

		const badGraph = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run(`--custom-schema ${schema}`, { graph: badGraph })).rejects.toMatch(
			"must have required property 'repository'",
		);
	});
});
