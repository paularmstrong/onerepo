import { existsSync } from 'node:fs';
import { builders } from '@onerepo/builders';
import { batch } from '@onerepo/subprocess';
import type { RunSpec } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Workspace } from '@onerepo/graph';

export const command = ['tsc', 'typescript', 'typecheck'];

export const description = 'Run typescript checking across workspaces';

type Argv = { tsconfig: string } & builders.WithWorkspaces & builders.WithAffected;

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.option('tsconfig', {
			type: 'string',
			default: 'tsconfig.json',
			description: 'The filename of the tsconfig to find in each workspace.',
			hidden: true,
		})
		.epilogue('Checks for the existence of `tsconfig.json` file and batches running `tsc --noEmit` in each workspace.');

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
