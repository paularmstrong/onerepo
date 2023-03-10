import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as subprocess from '@onerepo/subprocess';
import * as applyReleasePlan from '@changesets/apply-release-plan';
import * as Prerelease from './prerelease';
import * as PublishConfig from '../publish-config';

import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Prerelease);

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('../publish-config', () => ({
	__esModule: true,
	...jest.requireActual('../publish-config'),
}));

describe('handler', () => {
	beforeEach(async () => {
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
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) })
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await run('--allow-dirty', { graph });

		expect(git.getStatus).not.toHaveBeenCalled();
		expect(inquirer.prompt).toHaveBeenCalled();
	});

	test('ensures logged in to the registry', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('', { graph });
		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: ['whoami'],
			})
		);
	});

	test('ensures logged in to the registry with yarn', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--package-manager=yarn', { graph });
		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'yarn',
				args: ['npm', 'whoami'],
			})
		);
	});

	test('can bypass the registry auth check', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--skip-auth', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'npm',
				args: ['whoami'],
			})
		);
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'yarn',
				args: ['npm', 'whoami'],
			})
		);
	});

	test('can prerelease all publishable workspaces', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '-w', 'burritos', 'churros', 'tacos', 'tortillas'],
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

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: expect.arrayContaining(['publish', '--tag', 'prerelease']),
				opts: { cwd: expect.stringMatching(/\/modules\/churros$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease'],
				opts: { cwd: expect.stringMatching(/\/modules\/tacos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease'],
				opts: { cwd: expect.stringMatching(/\/modules\/tortillas$/) },
			}),
		]);
	});

	test('can prerelease selected workspaces with dependencies', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['burritos'] });
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '-w', 'burritos', 'tortillas'],
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

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease'],
				opts: { cwd: expect.stringMatching(/\/modules\/tortillas$/) },
			}),
		]);
	});

	test('prompts for OTP and passes to publish', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012', choices: ['burritos'] });
		await run('--otp', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease', '--otp', '789012'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease', '--otp', '789012'],
				opts: { cwd: expect.stringMatching(/\/modules\/tortillas$/) },
			}),
		]);
	});

	test('adds --access from publishConfig', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['churros'] });
		await run('--otp', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'prerelease', '--access', 'public'],
				opts: { cwd: expect.stringMatching(/\/modules\/churros$/) },
			}),
		]);
	});

	test('uses yarn npm publish if yarn', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ choices: ['_ALL_'] });

		await run('--package-manager=yarn', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish', '--tag', 'prerelease'],
				}),
			])
		);
	});
});
