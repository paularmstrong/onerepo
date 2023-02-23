import * as Vitest from './vitest';
import { getCommand } from '@onerepo/test-cli';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';

const { run } = getCommand(Vitest);

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['foo.js', 'bar/baz.js'] });
		await run('');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node_modules/.bin/vitest',
				args: ['--config', './vitest.config.ts', 'related', 'foo.js', 'bar/baz.js'],
			})
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node_modules/.bin/vitest',
				args: ['--config', './vitest.config.ts', expect.stringMatching(/\/burritos$/)],
			})
		);
	});

	test('can run the node inspector/debugger', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['foo.js'] });

		await run('--inspect');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: [
					'--inspect',
					'--inspect-brk',
					'node_modules/.bin/vitest',
					'--config',
					'./vitest.config.ts',
					'related',
					'foo.js',
				],
			})
		);
	});

	test('passes through other arguments', async () => {
		await run('-- -w foo');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node_modules/.bin/vitest',
				args: ['--config', './vitest.config.ts', '-w', 'foo'],
			})
		);
	});
});
