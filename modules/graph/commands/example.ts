import type { Builder, Handler } from '@onerepo/cli';
import { logger } from '@onerepo/cli';

export const command = 'example';

type Args = {
	workspaces?: Array<string>;
};

export const builder: Builder<Args> = (yargs) =>
	yargs.option('workspaces', {
		alias: 'w',
		type: 'array',
		string: true,
		description: 'List of workspace names to restrict building against',
	});

export const description = 'This is an example';

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { workspaces: workspaceNames = graph.dependencies() } = argv;

	for (const name of workspaceNames) {
		const workspace = graph.getByName(name)!;
		if (workspace.private) {
			continue;
		}

		logger.log(graph.dependents(workspace.name));
	}
};
