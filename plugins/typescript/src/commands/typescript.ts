import { existsSync } from 'node:fs';
import * as builders from '@onerepo/builders';
import type { RunSpec } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Workspace } from '@onerepo/graph';

export const command = ['tsc', 'typescript', 'typecheck'];

export const description = 'Run typescript checking across workspaces';

type Argv = { pretty: boolean; tsconfig: string } & builders.WithWorkspaces & builders.WithAffected;

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.option('pretty', {
			type: 'boolean',
			default: true,
			description: 'Control TypeScript’s `--pretty` flag.',
		})
		.option('tsconfig', {
			type: 'string',
			default: 'tsconfig.json',
			description: 'The filename of the tsconfig to find in each workspace.',
			hidden: true,
		})
		.epilogue('Checks for the existence of `tsconfig.json` file and batches running `tsc --noEmit` in each workspace.');

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { pretty, tsconfig } = argv;
	const workspaces = await getWorkspaces();

	const procs = workspaces.reduce((memo: Array<RunSpec>, workspace: Workspace) => {
		if (existsSync(workspace.resolve(tsconfig))) {
			memo.push({
				name: `Typecheck ${workspace.name}`,
				cmd: 'tsc',
				args: ['-p', workspace.resolve(tsconfig), '--noEmit', pretty ? '--pretty' : '--no-pretty'],
			});
		}
		return memo;
	}, [] as Array<RunSpec>);

	await graph.packageManager.batch(procs);
	// TODO: this still isn't logging!
	logger.info('===============\nhello\n--------------');
};
