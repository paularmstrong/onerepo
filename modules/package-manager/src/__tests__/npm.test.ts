import * as subprocess from '@onerepo/subprocess';
import { Npm as manager } from '../npm';

describe('NPM', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	describe('add', () => {
		test('Adds single packages', async () => {
			await manager.add('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos'],
				}),
			);
		});

		test('Adds multiple packages', async () => {
			await manager.add(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos', 'burritos'],
				}),
			);
		});

		test('Adds as dev dependencies', async () => {
			await manager.add(['tacos', 'burritos'], { dev: true });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos', 'burritos', '--save-dev'],
				}),
			);
		});
	});

	describe('install', () => {
		test('Runs install', async () => {
			await expect(manager.install()).resolves.toEqual('package-lock.json');
			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install'],
				}),
			);
		});
	});

	describe('loggedIn', () => {
		test('returns false if cmd fails', async () => {
			vi.spyOn(subprocess, 'run').mockRejectedValue(new Error());
			await expect(manager.loggedIn()).resolves.toBe(false);
		});

		test('returns true if cmd succeeds', async () => {
			await expect(manager.loggedIn()).resolves.toBe(true);
		});

		test('passes registry', async () => {
			await expect(manager.loggedIn({ registry: 'foobar' })).resolves.toBe(true);
			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['whoami', '--registry', 'foobar'],
				}),
			);
		});
	});

	describe('publish', () => {
		let dryRun = process.env.ONEREPO_DRY_RUN;
		beforeEach(() => {
			dryRun = process.env.ONEREPO_DRY_RUN;
		});

		afterEach(() => {
			process.env.ONEREPO_DRY_RUN = dryRun;
		});

		test('Publishes', async () => {
			await manager.publish();

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish'],
				}),
			);
		});

		test('includes --dry-run', async () => {
			process.env.ONEREPO_DRY_RUN = 'true';

			await manager.publish();

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--dry-run'],
					runDry: true,
				}),
			);
		});

		test('includes --access', async () => {
			await manager.publish({ access: 'restricted' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--access', 'restricted'],
				}),
			);
		});

		test('includes --tag', async () => {
			await manager.publish({ tag: 'tacos' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--tag', 'tacos'],
				}),
			);
		});

		test('includes --otp', async () => {
			await manager.publish({ otp: 'taco123' });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--otp', 'taco123'],
				}),
			);
		});

		test('can publish multiple workspaces', async () => {
			await manager.publish({
				workspaces: [
					{ name: 'tacos', location: 'modules/tacos' },
					{ name: 'burritos', location: 'modules/burritos' },
				],
			});

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish', '--workspaces', 'tacos', 'burritos'],
				}),
			);
		});
	});

	describe('publishable', () => {
		test('filters Workspaces by the ones with a version not in the registry', async () => {
			vi.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map((spec) => {
						if (typeof spec === 'function') {
							return spec();
						}
						const { args } = spec;
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							versions.push('1.2.3', '1.2.4');
						} else if (args?.includes('burritos')) {
							versions.push('4.5.6');
						}

						return [JSON.stringify({ name: args![1]!, versions }), ''];
					}) as Array<[string, string]>,
				);
			});

			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([{ name: 'tacos', version: '1.2.5' }]);
		});

		test('ignores errors', async () => {
			vi.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map((spec) => {
						if (typeof spec === 'function') {
							return spec();
						}
						const { args } = spec;
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							versions.push('1.2.3', '1.2.5');
						} else if (args?.includes('burritos')) {
							return new Error('i do not know');
						}

						return [JSON.stringify({ name: args![1]!, versions }), ''];
					}) as Array<[string, string]>,
				);
			});

			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([{ name: 'burritos', version: '4.5.6' }]);
		});

		test('does not fail for unparseable json', async () => {
			vi.spyOn(subprocess, 'batch').mockImplementation((calls) => {
				return Promise.resolve(
					calls.map((spec) => {
						if (typeof spec === 'function') {
							return spec();
						}
						const { args } = spec;
						const versions: Array<string> = [];
						if (args?.includes('tacos')) {
							return ['', ''];
						} else if (args?.includes('burritos')) {
							return ['LOL', ''];
						}

						return [JSON.stringify({ name: args![2]!, versions }), ''];
					}) as Array<[string, string]>,
				);
			});
			const publishable = await manager.publishable([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);

			expect(publishable).toEqual([
				{ name: 'tacos', version: '1.2.5' },
				{ name: 'burritos', version: '4.5.6' },
			]);
		});
	});

	describe('remove', () => {
		test('Removes single packages', async () => {
			await manager.remove('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['uninstall', 'tacos'],
				}),
			);
		});

		test('Adds multiple packages', async () => {
			await manager.remove(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['uninstall', 'tacos', 'burritos'],
				}),
			);
		});
	});
});
