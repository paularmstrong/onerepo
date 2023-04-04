import { batch, run } from '@onerepo/subprocess';
import type { PackageManager, MinimalWorkspace } from './methods';

export const Npm = {
	add: async (packages, opts = {}) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'npm',
			args: ['install', ...pkgs, ...(opts?.dev ? ['--save-dev'] : [])],
		});
	},

	install: async (cwd?: string) => {
		await run({
			name: 'Install dependencies',
			cmd: 'npm',
			args: ['install'],
			opts: { cwd },
		});

		return 'package-lock.json';
	},

	loggedIn: async (opts = {}) => {
		try {
			await run({
				name: 'Who am I?',
				cmd: 'npm',
				args: ['whoami', ...(opts.registry ? ['--registry', opts.registry] : [])],
				runDry: true,
			});
			return true;
		} catch (e) {
			return false;
		}
	},

	publish: async (opts = {}) => {
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

	publishable: async <T extends MinimalWorkspace>(workspaces: Array<T>) => {
		const filtered = workspaces.filter((ws) => !ws.private && ws.version);
		const publishable = new Set<T>(filtered);

		const responses = await batch(
			filtered.map(({ name }) => ({
				name: `Get ${name} versions`,
				cmd: 'npm',
				args: ['info', name, 'name', 'versions', '--json'],
				runDry: true,
				skipFailures: true,
			}))
		);

		for (const res of responses) {
			if (res instanceof Error || res[1]) {
				continue;
			}
			const { name, versions } = JSON.parse(res[0]);
			const ws = workspaces.find((ws) => ws.name === name);
			if (ws && ws.version && versions.includes(ws.version)) {
				publishable.delete(ws);
			}
		}

		return Array.from(publishable);
	},

	remove: async (packages) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd: 'npm',
			args: ['uninstall', ...pkgs],
		});
	},
} satisfies PackageManager;
