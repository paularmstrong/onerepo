import { existsSync } from 'node:fs';
import { batch, withAffected, withWorkspaces } from '@onerepo/cli';
import type { Builder, Handler, RunSpec, WithAffected, WithWorkspaces } from '@onerepo/cli';
import type { Workspace } from '@onerepo/graph';

export const command = 'tsc';

export const aliases = ['typescript', 'typecheck'];

export const description = 'Run typescript checking across workspaces';

type Argv = WithWorkspaces & WithAffected;

export const builder: Builder<Argv> = (yargs) => withAffected(withWorkspaces(yargs)).usage('$0 tsc [options]');

export const handler: Handler<Argv> = async (argv, { getWorkspaces }) => {
	const workspaces = await getWorkspaces();

	const procs = workspaces.reduce((memo: Array<RunSpec>, workspace: Workspace) => {
		if (existsSync(workspace.resolve('tsconfig.json'))) {
			memo.push({
				name: `Typecheck ${workspace.name}`,
				cmd: 'npx',
				args: ['tsc', '-p', workspace.resolve('tsconfig.json'), '--noEmit'],
			});
		}
		return memo;
	}, [] as Array<RunSpec>);

	await batch(procs);
};
