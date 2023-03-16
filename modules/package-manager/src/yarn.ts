import { batch, run } from '@onerepo/subprocess';
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

	publish: async (opts = {}): Promise<void> => {
		const { access, cwd, otp, tag, workspaces } = opts;
		const options: Array<string> = [
			...(access ? ['--access', access] : []),
			...(tag ? ['--tag', tag] : []),
			...(otp ? ['--otp'] : []),
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

	publishable: async (workspaces): Promise<Array<string>> => {
		const [ndjson] = await run({
			name: 'Get versions',
			cmd: 'yarn',
			args: ['npm', 'info', ...workspaces.map(({ name }) => name), '--json'],
			runDry: true,
		});

		const responses = ndjson.split('\n').map((str) => JSON.parse(str) as { name: string; versions: Array<string> });

		for (const info of responses) {
			// TODO
		}

		return [];
	},
} satisfies IPackageManager;
