import path from 'node:path';
import inquirer from 'inquirer';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import * as Publish from './publish';
import * as PublishConfig from '../publish-config';

import { getCommand } from '@onerepo/test-cli';

const { run } = getCommand(Publish);

jest.mock('@changesets/apply-release-plan');
jest.mock('@onerepo/git');
jest.mock('@onerepo/subprocess');
jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));
jest.mock('../publish-config', () => ({
	__esModule: true,
	...jest.requireActual('../publish-config'),
}));

describe('handler', () => {
	beforeEach(async () => {
		jest.spyOn(git, 'updateIndex').mockResolvedValue('');
		jest.spyOn(git, 'getStatus').mockResolvedValue('');
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
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getStatus').mockResolvedValue('M  Foobar');
		await expect(run('', { graph })).rejects.toBeUndefined();

		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'Build workspaces' }));
		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'npm', args: expect.arrayContaining(['publish']) })
		);
		expect(subprocess.batch).not.toHaveBeenCalled();
	});

	test('does nothing if not on head branch', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(git, 'getBranch').mockResolvedValue('tacos-tacos-tacos');
		await expect(run('', { graph })).rejects.toBeUndefined();

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
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'yarn'));

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

	test('publishes all workspaces', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['tasks', '-c', 'build', '-w', 'burritos', 'churros', 'tacos', 'tortillas'],
			})
		);

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest', '--access', 'public'],
				opts: { cwd: expect.stringMatching(/\/modules\/churros$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest'],
				opts: { cwd: expect.stringMatching(/\/modules\/tacos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest'],
				opts: { cwd: expect.stringMatching(/\/modules\/tortillas$/) },
			}),
		]);
	});

	test('does not publish workspaces that are already published versions', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info') && args?.includes('burritos')) {
				return Promise.resolve(['{"versions":["0.0.1","0.1.7"]}', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				return Promise.resolve(['{"versions":["0.0.1"]}', '']);
			}
			return Promise.resolve(['', '']);
		});
		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: expect.arrayContaining(['tasks', '-c', 'build', '-w', 'burritos']),
			})
		);

		expect(subprocess.batch).not.toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--tag', 'latest'],
					opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
				}),
			])
		);
	});

	test('prompts for OTP and passes to publish', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ otp: '789012' });
		await run('--otp', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest', '--otp', '789012'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest', '--otp', '789012', '--access', 'public'],
				opts: { cwd: expect.stringMatching(/\/modules\/churros$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest', '--otp', '789012'],
				opts: { cwd: expect.stringMatching(/\/modules\/tacos$/) },
			}),
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest', '--otp', '789012'],
				opts: { cwd: expect.stringMatching(/\/modules\/tortillas$/) },
			}),
		]);
	});

	test('does not build or publish when no workspaces need to publish', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				if (args.includes('burritos')) {
					return Promise.resolve(['{"versions":["0.1.7"]}', '']);
				}
				if (args.includes('churros')) {
					return Promise.resolve(['{"versions":["0.2.0"]}', '']);
				}
				if (args.includes('tacos')) {
					return Promise.resolve(['{"versions":["0.2.0"]}', '']);
				}
				if (args.includes('tortillas')) {
					return Promise.resolve(['{"versions":["0.4.5"]}', '']);
				}
			}
			return Promise.resolve(['', '']);
		});

		await run('', { graph });

		expect(subprocess.run).not.toHaveBeenCalledWith(
			expect.objectContaining({ cmd: process.argv[1], args: expect.arrayContaining(['tasks', '-c', 'build']) })
		);

		expect(subprocess.batch).not.toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: expect.arrayContaining(['publish']),
			}),
		]);
	});

	test('publishes if not found in the npm registry', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const e404 = 'npm ERR! code E404\nnpm ERR! 404 Not Found';

		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				if (args.includes('burritos')) {
					// IMPORTANT: npm puts error to stderr, not stdout
					return Promise.resolve(['', e404]);
				}
				return Promise.resolve(['{"versions":["0.2.0","0.4.5"]}', '']);
			}
			return Promise.resolve(['', '']);
		});

		await run('', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
		]);
	});

	test('publishes if not found in the npm registry using yarn', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		const e404 =
			'{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"The remote server failed to provide the requested resource"}';

		jest.spyOn(subprocess, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'git' && args?.includes('rev-parse')) {
				return Promise.resolve(['123456', '']);
			}
			if (cmd === 'npm' && args?.includes('info')) {
				if (args.includes('burritos')) {
					// IMPORTANT: yarn puts error to stdout, not stderr
					return Promise.resolve([e404, '']);
				}
				return Promise.resolve(['{"versions":["0.2.0","0.4.5"]}', '']);
			}
			return Promise.resolve(['', '']);
		});

		await run('', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith([
			expect.objectContaining({
				cmd: 'npm',
				args: ['publish', '--tag', 'latest'],
				opts: { cwd: expect.stringMatching(/\/modules\/burritos$/) },
			}),
		]);
	});

	test('uses yarn npm info if yarn', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--package-manager=yarn', { graph });

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'yarn',
				args: ['npm', 'info', 'burritos', '--json'],
			})
		);
	});

	test('uses yarn npm publish if yarn', async () => {
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));
		await run('--package-manager=yarn', { graph });

		expect(subprocess.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish', '--tag', 'latest'],
				}),
			])
		);
	});
});
