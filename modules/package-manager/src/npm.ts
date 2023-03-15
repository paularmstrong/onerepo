import { run } from '@onerepo/subprocess';
import type { IPackageManager } from './methods';

export const Npm = {
	install: async (): Promise<void> => {
		await run({
			name: 'Install dependencies',
			cmd: 'npm',
			args: ['install'],
		});
	},

	add: async (packages, opts = {}): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'npm',
			args: ['install', ...pkgs, ...(opts?.dev ? ['--save-dev'] : [])],
		});
	},

	remove: async (packages): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd: 'npm',
			args: ['uninstall', ...pkgs],
		});
	},

	publish: async (): Promise<void> => {
		await run({
			name: 'Publish',
			cmd: 'npm',
			args: ['publish'],
		});
	},
} satisfies IPackageManager;
