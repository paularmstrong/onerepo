import * as subprocess from '@onerepo/subprocess';
import { Yarn as manager } from '../yarn';

jest.mock('@onerepo/subprocess', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/subprocess'),
}));

describe('Yarn', () => {
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
			jest.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map(({ args }) => {
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							versions.push('1.2.3', '1.2.4');
						} else if (args?.includes('burritos')) {
							versions.push('4.5.6');
						}

						return [JSON.stringify({ name: args![2]!, versions }), ''];
					}) as Array<[string, string]>
				);
			});

			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([{ name: 'tacos', version: '1.2.5' }]);
		});

		test('ignores errors', async () => {
			jest.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map(({ args }) => {
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							versions.push('1.2.3', '1.2.5');
						} else if (args?.includes('burritos')) {
							return new Error('i do not know');
						}

						return [JSON.stringify({ name: args![2]!, versions }), ''];
					}) as Array<[string, string]>
				);
			});

			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([{ name: 'burritos', version: '4.5.6' }]);
		});

		test('ignores when yarn npm info includes newlines', async () => {
			jest.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map(({ args }) => {
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							versions.push('1.2.3', '1.2.5');
						} else if (args?.includes('burritos')) {
							return [
								'{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"The remote server failed to provide the requested resource"}\n{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"  Response Code: 404 (Not Found)"}\n{"type":"error","name":35,"displayName":"YN0035","indent":"","data":"  Request Method: GET"}',
								'',
							];
						}

						return [JSON.stringify({ name: args![2]!, versions }), ''];
					}) as Array<[string, string]>
				);
			});

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
