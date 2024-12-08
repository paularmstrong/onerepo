import { batch, run } from '@onerepo/subprocess';
import { prerelease } from 'semver';
import type { PackageManager, MinimalWorkspace, NpmInfo } from './methods';

const cmd = 'yarn';

export const Yarn = {
	add: async (packages, opts = {}) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd,
			args: ['add', ...pkgs, ...(opts?.dev ? ['--dev'] : [])],
		});
	},

	batch: async (processes) => {
		return batch(
			processes.map((proc) => ({
				...proc,
				cmd: 'yarn',
				args: ['exec', proc.cmd, ...(proc.args ?? [])],
			})),
		);
	},

	dedupe: async () => {
		await run({
			name: 'Dedupe dependencies',
			cmd,
			args: ['dedupe'],
		});
	},

	info: async (name, spec) => {
		try {
			const [data] = await run({
				name: `Get ${name} info`,
				...spec,
				cmd,
				args: ['npm', 'info', name, '--json'],
			});

			return JSON.parse(data) as NpmInfo;
		} catch {
			return null;
		}
	},

	install: async (cwd?: string) => {
		await run({
			name: 'Install dependencies',
			cmd,
			args: ['install'],
			opts: { cwd },
		});

		return 'yarn.lock';
	},

	loggedIn: async (opts = {}) => {
		try {
			await run({
				name: 'Who am I?',
				cmd,
				args: ['npm', 'whoami', ...(opts.scope ? ['--scope', opts.scope] : [])],
				runDry: true,
			});
			return true;
		} catch {
			return false;
		}
	},

	publish: async (opts) => {
		const { access, otp, tag, workspaces } = opts;
		const options: Array<string> = [
			'--tolerate-republish',
			...(access ? ['--access', access] : []),
			...(otp ? ['--otp', otp] : []),
		];

		await batch(
			workspaces.map((ws) => {
				const pre = prerelease(ws.version!);
				const thisTag = pre && pre[0] ? `${pre[0]}` : (tag ?? 'latest');
				return {
					name: `Publish ${ws.name}`,
					cmd,
					args: ['npm', 'publish', '--tag', thisTag, ...options],
					opts: { cwd: ws.location },
				};
			}),
			{ maxParallel: 40 },
		);
	},

	publishable: async <T extends MinimalWorkspace>(workspaces: Array<T>) => {
		const filtered = workspaces.filter((ws) => !ws.private && ws.version);
		const publishable = new Set<T>(filtered);

		const responses = await batch(
			filtered.map(({ name }) => ({
				name: `Get ${name} versions`,
				cmd,
				args: ['npm', 'info', name, '--json'],
				runDry: true,
				skipFailures: true,
			})),
		);

		for (const res of responses) {
			if (res instanceof Error || res[1] || res[0].includes('\n')) {
				continue;
			}
			try {
				const { name, versions } = JSON.parse(res[0]);
				const ws = workspaces.find((ws) => ws.name === name);
				if (ws && ws.version && versions.includes(ws.version)) {
					publishable.delete(ws);
				}
			} catch {
				// no catch
			}
		}

		return Array.from(publishable);
	},

	remove: async (packages) => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Remove packages',
			cmd,
			args: ['remove', ...pkgs],
		});
	},

	run: async (opts) => {
		return await run({
			...opts,
			cmd: 'yarn',
			args: ['exec', opts.cmd, ...(opts.args ?? [])],
		});
	},
} satisfies PackageManager;
