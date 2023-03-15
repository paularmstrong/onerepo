import * as subprocess from '@onerepo/subprocess';
import { Yarn as manager } from '../yarn';

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
					cmd: 'yarn',
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
	});
});
