import { run } from '@onerepo/subprocess';
import type { IPackageManager } from './methods';

export const Yarn = {
	install: async (): Promise<void> => {
		await run({
			name: 'Install dependencies',
			cmd: 'yarn',
			args: ['install'],
		});
	},

	add: async (packages, opts = {}): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'yarn',
			args: ['add', ...pkgs, ...(opts?.dev ? ['--dev'] : [])],
		});
	},

	remove: async (packages): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd: 'yarn',
			args: ['remove', ...pkgs],
		});
	},

	publish: async (): Promise<void> => {
		await run({
			name: 'Publish',
			cmd: 'yarn',
			args: ['npm', 'publish'],
		});
	},
} satisfies IPackageManager;
