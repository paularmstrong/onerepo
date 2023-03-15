import * as subprocess from '@onerepo/subprocess';
import { Npm as manager } from '../npm';

jest.mock('@onerepo/subprocess', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/subprocess'),
}));

describe('NPM', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	describe('install', () => {
		test('Runs install', async () => {
			await manager.install();
			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install'],
				})
			);
		});
	});

	describe('add', () => {
		test('Adds single packages', async () => {
			await manager.add('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos'],
				})
			);
		});

		test('Adds multiple packages', async () => {
			await manager.add(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos', 'burritos'],
				})
			);
		});

		test('Adds as dev dependencies', async () => {
			await manager.add(['tacos', 'burritos'], { dev: true });

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['install', 'tacos', 'burritos', '--save-dev'],
				})
			);
		});
	});

	describe('remove', () => {
		test('Removes single packages', async () => {
			await manager.remove('tacos');

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['uninstall', 'tacos'],
				})
			);
		});

		test('Adds multiple packages', async () => {
			await manager.remove(['tacos', 'burritos']);

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['uninstall', 'tacos', 'burritos'],
				})
			);
		});
	});

	describe('publish', () => {
		test('Publishes', async () => {
			await manager.publish();

			expect(subprocess.run).toHaveBeenCalledWith(
				expect.objectContaining({
					cmd: 'npm',
					args: ['publish'],
				})
			);
		});
	});
});
