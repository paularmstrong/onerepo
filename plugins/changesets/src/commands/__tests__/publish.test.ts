import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import { getCommand } from '@onerepo/test-cli';
import * as Publish from '../publish';
import * as PublishConfig from '../../publish-config';

const { run } = getCommand(Publish);

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));
jest.mock('../../publish-config', () => ({
	__esModule: true,
	...jest.requireActual('../../publish-config'),
}));

describe('handler', () => {
	const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

	beforeEach(async () => {
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(true);
		jest.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		jest.spyOn(graph.packageManager, 'publishable').mockResolvedValue(graph.workspaces.filter((ws) => !ws.private));

		jest.spyOn(git, 'updateIndex').mockResolvedValue('');
		jest.spyOn(git, 'isClean').mockResolvedValue(true);
		jest.spyOn(git, 'getBranch').mockResolvedValue(process.env.ONE_REPO_HEAD_BRANCH ?? 'main');

		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				return Promise.resolve(['{"versions":["0.0.1"]}', '']);
			}
			return Promise.resolve(['', '']);
		});
		jest.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		jest.spyOn(PublishConfig, 'resetPackageJson').mockResolvedValue();
		jest.spyOn(file, 'write').mockResolvedValue();
	});

	test('does nothing if git working tree is dirty', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) })
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('does nothing if not on head branch', async () => {
		jest.spyOn(git, 'getBranch').mockResolvedValue('tacos-tacos-tacos');
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) })
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		jest.spyOn(git, 'isClean').mockResolvedValue(false);
		await run('--allow-dirty', { graph });

		expect(git.isClean).not.toHaveBeenCalled();
	});

	test('ensures logged in to the registry', async () => {
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toBeUndefined();
	});

	test('can bypass the registry auth check', async () => {
		jest.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await run('--skip-auth', { graph });

		expect(graph.packageManager.loggedIn).not.toHaveBeenCalledWith();
	});

	test('publishes all workspaces', async () => {
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '--no-affected', '-w', 'burritos', 'churros', 'tacos', 'tortas', 'tortillas'],
			})
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: graph.workspaces.filter((ws) => !ws.private),
			tag: 'latest',
			otp: undefined,
		});
	});

	test('only publishes publishable workspaces', async () => {
		jest.spyOn(graph.packageManager, 'publishable').mockResolvedValue([graph.getByName('burritos')]);
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: expect.arrayContaining(['tasks', '-c', 'build', '--no-affected', '-w', 'burritos']),
			})
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: [graph.getByName('burritos')],
			tag: 'latest',
			otp: undefined,
		});
	});

	test('prompts for OTP and passes to publish', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012' });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: graph.workspaces.filter((ws) => !ws.private),
			tag: 'latest',
			otp: '789012',
		});
	});

	test('does not build or publish when no workspaces need to publish', async () => {
		jest.spyOn(graph.packageManager, 'publishable').mockResolvedValue([]);

		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: expect.arrayContaining(['tasks', '-c', 'build', '--no-affected']),
			})
		);
	});
});
