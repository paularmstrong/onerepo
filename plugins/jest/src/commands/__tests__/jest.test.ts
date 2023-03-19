import * as Jest from '../jest';
import { getCommand } from '@onerepo/test-cli';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';

const { run } = getCommand(Jest);

jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/git');

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		jest.spyOn(git, 'getMergeBase').mockResolvedValue('tacobase');
		await run('');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--changedSince', 'tacobase'],
				opts: { stdio: 'inherit' },
			})
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', expect.stringMatching(/modules\/burritos$/)],
				opts: { stdio: 'inherit' },
			})
		);
	});

	test('can run the node inspector/debugger', async () => {
		jest.spyOn(git, 'getMergeBase').mockResolvedValue('burritobase');

		await run('--inspect');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: [
					'--inspect',
					'--inspect-brk',
					'node_modules/.bin/jest',
					'--config',
					'./jest.config.js',
					'--changedSince',
					'burritobase',
				],
			})
		);
	});

	test('passes through other arguments', async () => {
		await run('-- -w foo');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '-w', 'foo'],
			})
		);
	});

	test('shortcuts --all to "." instead of workspaces individually', async () => {
		await run('--all');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '.'],
			})
		);
	});
});
