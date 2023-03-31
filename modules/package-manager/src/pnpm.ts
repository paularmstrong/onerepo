import { batch, run } from '@onerepo/subprocess';
import type { PackageManager, MinimalWorkspace } from './methods';

export const Pnpm = {
	add: async (packages, opts = {}) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'pnpm',
			args: ['add', ...pkgs, ...(opts?.dev ? ['--save-dev'] : [])],
		});
	},

	install: async (cwd?: string) => {
		await run({
			name: 'Install dependencies',
			cmd: 'pnpm',
			args: ['install'],
			opts: { cwd },
		});

		return 'pnpm-lock.json';
	},

	loggedIn: async (opts = {}) => {
		try {
			await run({
				name: 'Who am I?',
				cmd: 'pnpm',
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
			cmd: 'pnpm',
			args: [
				'publish',
				'--no-git-checks',
				...(access ? ['--access', access] : []),
				...(tag ? ['--tag', tag] : []),
				...(otp ? ['--otp', otp] : []),
				...(workspaces?.length ? workspaces.map((ws) => ['--filter', ws.name]) : []).flat(),
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
				cmd: 'pnpm',
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
			cmd: 'pnpm',
			args: ['remove', ...pkgs],
		});
	},
} satisfies PackageManager;
