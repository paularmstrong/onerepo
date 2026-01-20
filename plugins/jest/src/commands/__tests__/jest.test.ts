import { getCommand } from '@onerepo/test-cli';
import * as onerepo from 'onerepo';
import * as Jest from '../jest.ts';

const { run } = await getCommand(Jest);

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(onerepo, 'run').mockResolvedValue(['', '']);
	});

	test('runs files related to changes by default', async () => {
		vi.spyOn(onerepo.git, 'isClean').mockResolvedValue(true);
		vi.spyOn(onerepo.git, 'getMergeBase').mockResolvedValue('tacobase');
		await run('');

		expect(onerepo.run).toHaveBeenCalledWith(
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

		expect(onerepo.run).toHaveBeenCalledWith(
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
		vi.spyOn(onerepo.git, 'isClean').mockResolvedValue(true);
		vi.spyOn(onerepo.git, 'getMergeBase').mockResolvedValue('burritobase');

		await run('--inspect');

		expect(onerepo.run).toHaveBeenCalledWith(
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

		expect(onerepo.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '--passWithNoTests', '-w', 'foo'],
			}),
		);
	});

	test('shortcuts --all to "." instead of Workspaces individually', async () => {
		await run('--all');

		expect(onerepo.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '--passWithNoTests', '.'],
			}),
		);
	});

	test('can turn off --colors with --no-pretty', async () => {
		await run('--no-pretty');

		expect(onerepo.run).toHaveBeenCalledWith(
			expect.objectContaining({
				args: expect.arrayContaining(['node_modules/.bin/jest', '--no-colors']),
			}),
		);
	});

	test('can disable --passWithNoTests', async () => {
		await run('--all --no-passWithNoTests');

		expect(onerepo.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'node',
				args: ['node_modules/.bin/jest', '--config', './jest.config.js', '--colors', '.'],
			}),
		);
	});
});
