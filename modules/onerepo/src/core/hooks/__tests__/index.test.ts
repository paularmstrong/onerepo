import * as subprocess from '@onerepo/subprocess';
import { hooks } from '..';

describe('shutdown handler', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'start').mockReturnValue(
			// @ts-ignore
			null,
		);
	});

	test('automatically syncs', async () => {
		const { shutdown } =
			// @ts-expect-error
			hooks({
				vcs: {
					autoSyncHooks: true,
					hooksPath: '.test-hooks',
				},
			});

		await shutdown({ _: ['foo', 'bar'] });

		expect(subprocess.start).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: process.argv[1],
				args: ['hooks', 'init'],
				opts: { detached: true },
			}),
		);
	});

	test('does not sync when "autoSyncHooks" is "false"', async () => {
		const { shutdown } =
			// @ts-expect-error
			hooks({
				vcs: {
					autoSyncHooks: false,
					hooksPath: '.test-hooks',
				},
			});

		await shutdown({ _: ['foo', 'bar'] });

		expect(subprocess.start).not.toHaveBeenCalled();
	});

	test.each([['install'], ['create']])('does not sync after command includes "%s"', async (command) => {
		const { shutdown } =
			// @ts-expect-error
			hooks({
				vcs: {
					autoSyncHooks: true,
					hooksPath: '.test-hooks',
				},
			});

		await shutdown({ _: [command] });

		expect(subprocess.start).not.toHaveBeenCalled();
	});

	test.each([
		['CI', '1'],
		['ONEREPO_SPAWN', '1'],
		['ONEREPO_SYNC_HOOKS', '0'],
		['ONEREPO_USE_HOOKS', '0'],
	])('does not sync when "%s" is "%s"', async (envVar, value) => {
		vi.stubEnv(envVar, value);
		const { shutdown } =
			// @ts-expect-error
			hooks({
				vcs: {
					autoSyncHooks: true,
					hooksPath: '.test-hooks',
				},
			});

		await shutdown({ _: ['foo', 'bar'] });

		expect(subprocess.start).not.toHaveBeenCalled();
	});
});
