import { batch, run } from '@onerepo/subprocess';
import type { IPackageManager } from './methods';

export const Yarn = {
	add: async (packages, opts = {}): Promise<void> => {
		const pkgs = Array.isArray(packages) ? packages : [packages];
		await run({
			name: 'Add packages',
			cmd: 'yarn',
			args: ['add', ...pkgs, ...(opts?.dev ? ['--dev'] : [])],
		});
	},

	install: async (): Promise<void> => {
		await run({
			name: 'Install dependencies',
			cmd: 'yarn',
			args: ['install'],
		});
	},

	publish: async (opts = {}): Promise<void> => {
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

	publishable: async <T extends { name: string; version: string }>(workspaces: Array<T>) => {
		let ndjson: string = '';
		try {
			const res = await run({
				name: 'Get versions',
				cmd: 'yarn',
				args: ['npm', 'info', ...workspaces.map(({ name }) => name), '--json'],
				runDry: true,
				skipFailures: true,
			});
			ndjson = res[0];
		} catch (e) {
			return workspaces;
		}

		const responses = ndjson
			.split('\n')
			.filter((out) => Boolean(out.trim()))
			.map((str) => JSON.parse(str) as { name: string; versions: Array<string> });
		const publishable = new Set<T>();

		for (const { name, versions } of responses) {
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
			cmd: 'yarn',
			args: ['remove', ...pkgs],
		});
	},
} satisfies IPackageManager;
