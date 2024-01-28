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

vi.mock('@changesets/apply-release-plan');

describe('handler', () => {
	const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

	beforeEach(async () => {
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(true);
		vi.spyOn(graph.packageManager, 'publish').mockResolvedValue(undefined);
		vi.spyOn(graph.packageManager, 'publishable').mockResolvedValue(graph.workspaces.filter((ws) => !ws.private));

		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
		vi.spyOn(git, 'isClean').mockResolvedValue(true);
		vi.spyOn(git, 'getBranch').mockResolvedValue(process.env.ONEREPO_HEAD_BRANCH ?? 'main');

		vi.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				return Promise.resolve(['{"versions":["0.0.1"]}', '']);
			}
			return Promise.resolve(['', '']);
		});
		vi.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
		vi.spyOn(PublishConfig, 'resetPackageJson').mockResolvedValue();
		vi.spyOn(file, 'write').mockResolvedValue();
	});

	test('does nothing if git working tree is dirty', async () => {
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toMatch('Working directory must be unmodified to ensure safe publish.');

		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) }),
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('does nothing if not on head branch', async () => {
		vi.spyOn(git, 'getBranch').mockResolvedValue('tacos-tacos-tacos');
		await expect(run('', { graph })).rejects.toMatch(
			'Publish is only available from the branch "main", but you are currently on "tacos-tacos-tacos". Please switch branches and re-run to continue.',
		);

		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) }),
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('can bypass the dirty working state check', async () => {
		vi.spyOn(git, 'isClean').mockResolvedValue(false);
		await run('--allow-dirty', { graph });

		expect(git.isClean).not.toHaveBeenCalled();
	});

	test('ensures logged in to the registry', async () => {
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await expect(run('', { graph })).rejects.toMatch(
			'You do not appear to have publish rights to the configured registr',
		);
	});

	test('can bypass the registry auth check', async () => {
		vi.spyOn(graph.packageManager, 'loggedIn').mockResolvedValue(false);
		await run('--skip-auth', { graph });

		expect(graph.packageManager.loggedIn).not.toHaveBeenCalledWith();
	});

	test('publishes all workspaces', async () => {
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

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: graph.workspaces.filter((ws) => !ws.private),
			tag: 'latest',
			otp: undefined,
		});
	});

	test('only publishes publishable workspaces', async () => {
		vi.spyOn(graph.packageManager, 'publishable').mockResolvedValue([graph.getByName('burritos')]);
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: expect.arrayContaining(['tasks', '-c', 'build', '--no-affected', '-w', 'burritos']),
			}),
		);

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: [graph.getByName('burritos')],
			tag: 'latest',
			otp: undefined,
		});
	});

	test('prompts for OTP and passes to publish', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012' });
		await run('--otp', { graph });

		expect(graph.packageManager.publish).toHaveBeenCalledWith({
			access: 'public',
			workspaces: graph.workspaces.filter((ws) => !ws.private),
			tag: 'latest',
			otp: '789012',
		});
	});

	test('does not build or publish when no Workspaces need to publish', async () => {
		vi.spyOn(graph.packageManager, 'publishable').mockResolvedValue([]);

		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: expect.arrayContaining(['tasks', '-c', 'build', '--no-affected']),
			}),
		);
	});
});
