import { run } from '@onerepo/subprocess';
import type { IPackageManager } from './methods';

export const Pnpm = {
	install: async (): Promise<void> => {
		await run({
			name: 'Install dependencies',
			cmd: 'pnpm',
			args: ['install'],
		});
	},

	add: async (packages, opts = {}): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'pnpm',
			args: ['add', ...pkgs, ...(opts?.dev ? ['--save-dev'] : [])],
		});
	},

	remove: async (packages): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd: 'pnpm',
			args: ['remove', ...pkgs],
		});
	},

	publish: async (): Promise<void> => {
		await run({
			name: 'Publish',
			cmd: 'pnpm',
			args: ['publish'],
		});
	},
} satisfies IPackageManager;
