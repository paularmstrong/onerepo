import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import * as Prerelease from '../prerelease';
import * as PublishConfig from '../../publish-config';
import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Prerelease);

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('../../publish-config', () => ({
	__esModule: true,
	...jest.requireActual('../../publish-config'),
}));

describe('handler', () => {
	const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

	beforeEach(async () => {
		jest.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(true);
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: [] });
		jest.spyOn(applyReleasePlan, 'default').mockImplementation(async () => []);
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');
		jest.spyOn(git, 'getStatus').mockResolvedValue('');
		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			return Promise.resolve(['', '']);
		});
		jest.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		jest.spyOn(PublishConfig, 'resetPackageJson').mockResolvedValue();
	});

	test('does nothing if git working tree is dirty', async () => {
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(graph.packageManager.publish).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		jest.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await run('--allow-dirty', { graph });

		expect(git.getStatus).not.toHaveBeenCalled();
		expect(inquirer.prompt).toHaveBeenCalled();
	});

	test('ensures logged in to the registry', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		jest.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		await expect(run('', { graph })).rejects.toBeUndefined();
		expect(graph.packageManager.loggedIn).toHaveBeenCalled();
	});

	test('can bypass the registry auth check', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await run('--skip-auth', { graph });

		expect(graph.packageManager.loggedIn).not.toHaveBeenCalled();
	});

	test('can prerelease all publishable workspaces', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '--no-affected', '-w', 'burritos', 'churros', 'tacos', 'tortillas'],
			})
		);

		expect(applyReleasePlan.default).toHaveBeenCalledWith(
			{
				changesets: [],
				releases: [
					expect.objectContaining({ name: 'burritos', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'churros', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tacos', newVersion: '0.0.0-pre.123456' }),
					expect.objectContaining({ name: 'tortillas', newVersion: '0.0.0-pre.123456' }),
				],
				preState: undefined,
			},
			expect.any(Object),
			expect.any(Object)
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [
				expect.objectContaining({ name: 'burritos' }),
				expect.objectContaining({ name: 'churros' }),
				expect.objectContaining({ name: 'tacos' }),
				expect.objectContaining({ name: 'tortillas' }),
			],
		});
	});

	test('can prerelease selected workspaces with dependencies', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['burritos'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '--no-affected', '-w', 'burritos', 'tortillas'],
			})
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
			expect.any(Object)
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'burritos' }), expect.objectContaining({ name: 'tortillas' })],
		});
	});

	test('prompts for OTP and passes to publish', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012', choices: ['burritos'] });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: '789012',
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'burritos' }), expect.objectContaining({ name: 'tortillas' })],
		});
	});

	test('adds --access from the first workspace', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['churros'] });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			otp: undefined,
			tag: 'prerelease',
			workspaces: [expect.objectContaining({ name: 'churros' })],
		});
	});
});
