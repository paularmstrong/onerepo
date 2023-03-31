import * as subprocess from '@onerepo/subprocess';
import { Yarn as manager } from '../yarn';

jest.mock('@onerepo/subprocess', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/subprocess'),
}));

describe('NPM', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest.spyOn(subprocess, 'batch').mockResolvedValue([['', '']]);
	});
	describe('add', () => {
		test('Adds single packages', async () => {
			await manager.add('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['add', 'tacos'],
				})
			);
		});

		test('Adds multiple packages', async () => {
			await manager.add(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['add', 'tacos', 'burritos'],
				})
			);
		});

		test('Adds as dev dependencies', async () => {
			await manager.add(['tacos', 'burritos'], { dev: true });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['add', 'tacos', 'burritos', '--dev'],
				})
			);
		});
	});

	describe('install', () => {
		test('Runs install', async () => {
			await expect(manager.install()).resolves.toEqual('yarn.lock');
			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['install'],
				})
			);
		});
	});

	describe('loggedIn', () => {
		test('returns false if cmd fails', async () => {
			jest.spyOn(subprocess, 'run').mockRejectedValue(new Error());
			await expect(manager.loggedIn()).resolves.toBe(false);
		});

		test('returns true if cmd succeeds', async () => {
			await expect(manager.loggedIn()).resolves.toBe(true);
		});

		test('passes scope', async () => {
			await expect(manager.loggedIn({ scope: 'foobar' })).resolves.toBe(true);
			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'whoami', '--scope', 'foobar'],
				})
			);
		});
	});

	describe('publish', () => {
		test('Publishes', async () => {
			await manager.publish();

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish'],
				})
			);
		});

		/**
		 * Yarn does not have a --dry-run option!
		 */
		test('Does not enable dry-run', async () => {
			await manager.publish();

			expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ runDry: true }));
		});

		test('includes --access', async () => {
			await manager.publish({ access: 'restricted' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish', '--access', 'restricted'],
				})
			);
		});

		test('includes --tag', async () => {
			await manager.publish({ tag: 'tacos' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish', '--tag', 'tacos'],
				})
			);
		});

		test('includes --otp', async () => {
			await manager.publish({ otp: 'taco123' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish', '--otp', 'taco123'],
				})
			);
		});

		test('can publish multiple workspaces', async () => {
			await manager.publish({
				workspaces: [
					{ name: 'tacos', location: 'modules/tacos' },
					{ name: 'burritos', location: 'modules/burritos' },
				],
			});

			expect(subprocess.run).not.toHaveBeenCalled();

			expect(subprocess.batch).toHaveBeenCalledWith([
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish'],
					opts: { cwd: 'modules/tacos' },
				}),
				expect.objectContaining({
					cmd: 'yarn',
					args: ['npm', 'publish'],
					opts: { cwd: 'modules/burritos' },
				}),
			]);
		});
	});

	describe('publishable', () => {
		test('filters workspaces by the ones with a version not in the registry', async () => {
			jest.spyOn(subprocess, 'run').mockRejectedValue([
				`{"name":"tacos","versions":["1.2.5"]}
{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"The remote server failed to provide the requested resource"}
{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"Response Code\\u001b[39m: \\u001b]8;;https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404\\u0007\\u001b[38;2;255;215;0m404\\u001b[39m (Not Found)\\u001b]8;;\\u0007"}
{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"  \\u001b[38;2;135;175;255mRequest Method\\u001b[39m: GET"}
{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"  \\u001b[38;2;135;175;255mRequest URL\\u001b[39m: \\u001b[38;2;215;95;215mhttps://registry.yarnpkg.com/burritos\\u001b[39m"}`,
				'',
			]);

			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([{ name: 'burritos', version: '4.5.6' }]);
		});
	});

	describe('remove', () => {
		test('Removes single packages', async () => {
			await manager.remove('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['remove', 'tacos'],
				})
			);
		});

		test('Adds multiple packages', async () => {
			await manager.remove(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'yarn',
					args: ['remove', 'tacos', 'burritos'],
				})
			);
		});
	});
});
