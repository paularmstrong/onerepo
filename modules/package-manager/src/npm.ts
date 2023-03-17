import { batch, run } from '@onerepo/subprocess';
import type { IPackageManager } from './methods';

export const Npm = {
	add: async (packages, opts = {}): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'npm',
			args: ['install', ...pkgs, ...(opts?.dev ? ['--save-dev'] : [])],
		});
	},

	install: async (): Promise<void> => {
		await run({
			name: 'Install dependencies',
			cmd: 'npm',
			args: ['install'],
		});
	},

	publish: async (opts = {}): Promise<void> => {
		const { access, cwd, otp, tag, workspaces } = opts;
		await run({
			name: `Publish${workspaces?.length ? ` ${workspaces.join(', ')}` : ''}`,
			cmd: 'npm',
			args: [
				'publish',
				...(access ? ['--access', access] : []),
				...(tag ? ['--tag', tag] : []),
				...(otp ? ['--otp', otp] : []),
				...(workspaces?.length ? ['--workspaces', ...workspaces.map((ws) => ws.name)] : []),
				...(process.env.ONE_REPO_DRY_RUN === 'true' ? ['--dry-run'] : []),
			],
			opts: cwd ? { cwd: cwd } : {},
			runDry: true,
		});
	},

	publishable: async <T extends { name: string; version: string }>(workspaces: Array<T>) => {
		const responses = await batch(
			workspaces.map(({ name }) => ({
				name: `Get ${name} versions`,
				cmd: 'npm',
				args: ['info', name, 'name', 'versions', '--json'],
				runDry: true,
			}))
		);

		const publishable = new Set<T>();

		for (const res of responses) {
			if (res instanceof Error || res[1]) {
				continue;
			}
			const { name, versions } = JSON.parse(res[0]);
			const ws = workspaces.find((ws) => ws.name === name);
			if (ws && !versions.includes(ws.version)) {
				publishable.add(ws);
			}
		}

		return Array.from(publishable);
	},

	remove: async (packages): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd: 'npm',
			args: ['uninstall', ...pkgs],
		});
	},
} satisfies IPackageManager;
