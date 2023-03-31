import { batch, run } from '@onerepo/subprocess';
import type { PackageManager, MinimalWorkspace } from './methods';

export const Yarn = {
	add: async (packages, opts = {}) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'yarn',
			args: ['add', ...pkgs, ...(opts?.dev ? ['--dev'] : [])],
		});
	},

	install: async (cwd?: string) => {
		await run({
			name: 'Install dependencies',
			cmd: 'yarn',
			args: ['install'],
			opts: { cwd },
		});

		return 'yarn.lock';
	},

	loggedIn: async (opts = {}) => {
		try {
			await run({
				name: 'Who am I?',
				cmd: 'yarn',
				args: ['npm', 'whoami', ...(opts.scope ? ['--scope', opts.scope] : [])],
				runDry: true,
			});
			return true;
		} catch (e) {
			return false;
		}
	},

	publish: async (opts = {}) => {
		const { access, cwd, otp, tag, workspaces } = opts;
		const options: Array<string> = [
			...(access ? ['--access', access] : []),
			...(tag ? ['--tag', tag] : []),
			...(otp ? ['--otp', otp] : []),
		];

		if (!workspaces?.length) {
			await run({
				name: 'Publish',
				cmd: 'yarn',
				args: ['npm', 'publish', ...options],
				opts: cwd ? { cwd: cwd } : {},
			});
		} else {
			await batch(
				workspaces.map((ws) => ({
					name: `Publish ${ws.name}`,
					cmd: 'yarn',
					args: ['npm', 'publish', ...options],
					opts: { cwd: ws.location },
				}))
			);
		}
	},

	publishable: async <T extends MinimalWorkspace>(workspaces: Array<T>) => {
		const filtered = workspaces.filter((ws) => !ws.private && ws.version);
		const publishable = new Set<T>(filtered);

		let ndjson: string = '';
		try {
			const res = await run({
				name: 'Get versions',
				cmd: 'yarn',
				args: ['npm', 'info', ...filtered.map(({ name }) => name), '--json'],
				runDry: true,
				skipFailures: true,
			});
			ndjson = res[0];
		} catch (e) {
			if (Array.isArray(e)) {
				ndjson = e[0];
			} else {
				return workspaces;
			}
		}

		const responses = ndjson
			.split('\n')
			.filter((out) => Boolean(out.trim()))
			.map((str) => JSON.parse(str) as { name: string; versions: Array<string> });

		for (const { name, versions } of responses) {
			if (!name || !versions) {
				continue;
			}
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
			cmd: 'yarn',
			args: ['remove', ...pkgs],
		});
	},
} satisfies PackageManager;
