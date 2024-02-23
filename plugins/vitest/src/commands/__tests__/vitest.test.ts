import { getCommand } from '@onerepo/test-cli';
import * as onerepo from 'onerepo';
import * as Vitest from '../vitest';

const { run, graph } = getCommand(Vitest);

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(onerepo.git, 'getMergeBase').mockResolvedValue('abc123');
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		vi.spyOn(onerepo.git, 'getModifiedFiles').mockResolvedValue(['foo.js', 'bar/baz.js']);
		await run('');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'vitest',
				args: ['--config', './vitest.config.ts', '--run', '--changed', 'abc123'],
			}),
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'vitest',
				args: ['--config', './vitest.config.ts', '--run', expect.stringMatching(/\/burritos$/)],
			}),
		);
	});

	test('can run the node inspector/debugger', async () => {
		vi.spyOn(onerepo.git, 'getModifiedFiles').mockResolvedValue(['foo.js']);

		await run('--inspect');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'vitest',
				args: ['--inspect', '--inspect-brk', '--config', './vitest.config.ts', '--run', '--changed', 'abc123'],
			}),
		);
	});

	test('passes through other arguments', async () => {
		await run('-- -w foo');

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'vitest',
				args: ['--config', './vitest.config.ts', '--watch', 'foo'],
			}),
		);
	});
});
