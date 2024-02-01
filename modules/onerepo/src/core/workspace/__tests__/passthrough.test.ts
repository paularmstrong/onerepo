import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import { builder, getHandler } from '../passthrough';

const graph = getGraph(path.join(__dirname, '__fixtures__/repo'));

describe('passthrough', () => {
	beforeEach(() => {
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
	});

	test('calls the command', async () => {
		const { run } = getCommand({ builder, handler: getHandler('eat', graph.getByName('fixture-tacos')) }, graph);

		await run();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eat',
				name: 'Run eat',
				opts: {
					cwd: graph.getByName('fixture-tacos').location,
					stdio: 'inherit',
				},
			}),
		);
	});

	test('passes args through', async () => {
		const { run } = getCommand(
			{ builder, handler: getHandler('eat --tacos', graph.getByName('fixture-tacos')) },
			graph,
		);

		await run();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eat',
				name: 'Run eat --tacos',
				args: ['--tacos'],
				opts: {
					cwd: graph.getByName('fixture-tacos').location,
					stdio: 'inherit',
				},
			}),
		);
	});

	test('includes passthrough args', async () => {
		const { run } = getCommand(
			{ builder, handler: getHandler('eat --tacos', graph.getByName('fixture-tacos')) },
			graph,
		);

		await run('-- --foo');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'eat',
				name: 'Run eat --tacos',
				args: ['--tacos', '--foo'],
				opts: {
					cwd: graph.getByName('fixture-tacos').location,
					stdio: 'inherit',
				},
			}),
		);
	});
});
