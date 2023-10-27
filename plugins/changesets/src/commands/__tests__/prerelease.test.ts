import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import { getCommand } from '@onerepo/test-cli';
import * as Prerelease from '../prerelease';
import * as PublishConfig from '../../publish-config';

const { run } = getCommand(Prerelease);

vi.mock('@changesets/apply-release-plan');

describe('handler', () => {
	const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

	beforeEach(async () => {
		vi.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(true);
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		vi.spyOn(applyReleasePlan, 'default').mockImplementation(async () => []);
		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
		vi.spyOn(git, 'isClean').mockResolvedValue(true);
		vi.spyOn(subprocess, 'run').mockImplementation((spec) => {
			if (typeof spec === 'function') {
				return spec();
			}
			const { cmd, args } = spec;

			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			return Promise.resolve(['', '']);
		});
		vi.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		vi.spyOn(PublishConfig, 'resetPackageJson').mockResolvedValue();
	});

	test('does nothing if git working tree is dirty', async () => {
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toMatch('Working directory must be unmodified to ensure safe pre-publis');

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(graph.packageManager.publish).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		vi.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await run('--allow-dirty', { graph });

		expect(git.isClean).not.toHaveBeenCalled();
		expect(inquirer.prompt).toHaveBeenCalled();
	});

	test('ensures logged in to the registry', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		vi.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		await expect(run('', { graph })).rejects.toMatch(
			'You do not appear to have publish rights to the configured registry',
		);
		expect(graph.packageManager.loggedIn).toHaveBeenCalled();
	});

	test('can bypass the registry auth check', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await run('--skip-auth', { graph });

		expect(graph.packageManager.loggedIn).not.toHaveBeenCalled();
	});

	test('can prerelease all publishable workspaces', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: [
					'tasks',
					'-c',
					'build',
					'--no-affected',
					'-w',
					'burritos',
					'churros',
					'tacos',
					'tortas',
					'tortillas',
					'-vv',
				],
			}),
		);

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			{
				changesets: [],
				releases: [
					expect.objectContaining({ name: 'burritos', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'churros', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tacos', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tortas', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tortillas', newVersion: '0.0.0-pre.123456' }),
				],
				preState: undefined,
			},
			expect.any(Object),
			expect.any(Object),
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [
				expect.objectContaining({ name: 'burritos' }),
				expect.objectContaining({ name: 'churros' }),
				expect.objectContaining({ name: 'tacos' }),
				expect.objectContaining({ name: 'tortas' }),
				expect.objectContaining({ name: 'tortillas' }),
			],
		});
	});

	test('can prerelease selected workspaces with dependencies', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['burritos'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '--no-affected', '-w', 'burritos', 'tortillas', '-vv'],
			}),
		);

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			{
				changesets: [],
				releases: [
					expect.objectContaining({ name: 'burritos', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tortillas', newVersion: '0.0.0-pre.123456' }),
				],
				preState: undefined,
			},
			expect.any(Object),
			expect.any(Object),
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'burritos' }), expect.objectContaining({ name: 'tortillas' })],
		});
	});

	test('prompts for OTP and passes to publish', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012', choices: ['burritos'] });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: '789012',
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'burritos' }), expect.objectContaining({ name: 'tortillas' })],
		});
	});

	test('adds --access from the first workspace', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['churros'] });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'churros' })],
		});
	});
});
