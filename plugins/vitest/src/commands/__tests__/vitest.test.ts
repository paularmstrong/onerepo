import { getCommand } from '@onerepo/test-cli';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';
import * as Vitest from '../vitest';

const { run } = getCommand(Vitest);

vi.mock('@onerepo/subprocess');
vi.mock('@onerepo/git');

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(git, 'getMergeBase').mockResolvedValue('abc123');
	});

	test('runs files related to changes by default', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['foo.js', 'bar/baz.js']);
		await run('');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: ['exec', 'vitest', '--config', './vitest.config.ts', '--run', '--changed', 'abc123'],
			}),
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: ['exec', 'vitest', '--config', './vitest.config.ts', '--run', expect.stringMatching(/\/burritos$/)],
			}),
		);
	});

	test('can run the node inspector/debugger', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['foo.js']);

		await run('--inspect');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: [
					'exec',
					'vitest',
					'--inspect',
					'--inspect-brk',
					'--config',
					'./vitest.config.ts',
					'--run',
					'--changed',
					'abc123',
				],
			}),
		);
	});

	test('passes through other arguments', async () => {
		await run('-- -w foo');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: ['exec', 'vitest', '--config', './vitest.config.ts', '--watch', 'foo'],
			}),
		);
	});
});
