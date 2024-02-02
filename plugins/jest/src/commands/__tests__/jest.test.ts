import { getCommand } from '@onerepo/test-cli';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';
import * as Jest from '../jest';

const { run } = getCommand(Jest);

jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/git');

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(true);
		jest.spyOn(git, 'getMergeBase').mockResolvedValue('tacobase');
		await run('');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: [
					'node_modules/.bin/jest',
					'--config',
					'./jest.config.js',
					'--colors',
					'--passWithNoTests',
					'--changedSince',
					'tacobase',
				],
				opts: { stdio: 'inherit' },
			}),
		);
	});

	test('if given --workspaces, runs those', async () => {
		await run('-w burritos');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: [
					'node_modules/.bin/jest',
					'--config',
					'./jest.config.js',
					'--colors',
					'--passWithNoTests',
					expect.stringMatching(/modules\/burritos$/),
				],
				opts: { stdio: 'inherit' },
			}),
		);
	});

	test('can run the node inspector/debugger', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(true);
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
					'--colors',
					'--passWithNoTests',
					'--changedSince',
					'burritobase',
				],
			}),
		);
	});

	test('passes through other arguments', async () => {
		await run('-- -w foo');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '--passWithNoTests', '-w', 'foo'],
			}),
		);
	});

	test('shortcuts --all to "." instead of Workspaces individually', async () => {
		await run('--all');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '--passWithNoTests', '.'],
			}),
		);
	});

	test('can turn off --colors with --no-pretty', async () => {
		await run('--no-pretty');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				args: expect.arrayContaining(['node_modules/.bin/jest', '--no-colors']),
			}),
		);
	});

	test('can disable --passWithNoTests', async () => {
		await run('--all --no-passWithNoTests');

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '.'],
			}),
		);
	});
});
