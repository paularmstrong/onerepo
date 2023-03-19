import * as Vitest from '../vitest';
import { getCommand } from '@onerepo/test-cli';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';

const { run } = getCommand(Vitest);

jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/git');

const modified = {
	all: [],
	added: [],
	modified: [],
	deleted: [],
	moved: [],
	unknown: [],
};

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ ...modified, all: ['foo.js', 'bar/baz.js'] });
		await run('');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node_modules/.bin/vitest',
				args: ['--config', './jest.config.ts', 'related', 'foo.js', 'bar/baz.js'],
			})
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node_modules/.bin/vitest',
				args: ['--config', './jest.config.ts', expect.stringMatching(/\/burritos$/)],
			})
		);
	});

	test('can run the node inspector/debugger', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ ...modified, all: ['foo.js'] });

		await run('--inspect');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: [
					'--inspect',
					'--inspect-brk',
					'node_modules/.bin/vitest',
					'--config',
					'./jest.config.ts',
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
				args: ['--config', './jest.config.ts', '-w', 'foo'],
			})
		);
	});
});
