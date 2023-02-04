import { existsSync } from 'fs';
import type { Builder, Handler, RunSpec } from '@onerepo/cli';
import { batch } from '@onerepo/cli';
import type { Workspace } from '@onerepo/graph';

export const command = 'tsc';

export const aliases = ['typescript', 'typecheck'];

export const description = 'Run typescript checking across workspaces';

type Argv = {
	all?: boolean;
	workspaces?: Array<string>;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Lint all files unconditionally',
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of workspace names to restrict type checking against',
		});

export const handler: Handler<Argv> = async (argv, { getAffected, graph }) => {
	const { all, workspaces: workspaceNames } = argv;

	let workspaces: Array<Workspace> = [];
	if (all) {
		workspaces = Object.values(graph.workspaces);
	} else if (workspaceNames) {
		workspaces = graph.getAllByName(workspaceNames);
	} else {
		workspaces = await getAffected();
	}

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
