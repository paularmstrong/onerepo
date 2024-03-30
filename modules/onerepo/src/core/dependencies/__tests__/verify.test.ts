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

	test('can turn off dependency verification', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('-a --mode off', { graph })).resolves.toBeTruthy();
	});

	test('can verify the dependencies in loose mode', async () => {
		const graphProd = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('-a --mode loose', { graph: graphProd })).rejects.toMatch('Version mismatches found in "menu"');

		const graphDev = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo-dev'));

		await expect(run('-a --mode loose', { graph: graphDev })).rejects.toMatch('Version mismatches found in "menu"');
	});

	test('can verify the dependencies in strict mode', async () => {
		const graphProd = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo'));

		await expect(run('-a --mode strict', { graph: graphProd })).rejects.toMatch('Version mismatches found in "menu"');

		const graphDev = getGraph(path.join(__dirname, '__fixtures__', 'bad-repo-dev'));

		await expect(run('-a --mode strict', { graph: graphDev })).rejects.toMatch('Version mismatches found in "menu"');

		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await expect(run('-a --mode strict', { graph: graph })).rejects.toMatch('Version mismatches found in "menu"');
	});

	test('verifies local versions (regression #678)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'regression-678'));

		await expect(run('-a --mode strict -vvvv', { graph })).rejects.toMatch(
			'Dependency "@acme/foo@1.0.0" expected to match "2.0.0"',
		);
	});

	test('verifies local dependencies are public (regression #682)', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'regression-682'));

		await expect(run('-a --mode strict -vvvv', { graph })).rejects.toMatch(
			'Dependency "@acme/foo" is a private workspace',
		);
	});
});
