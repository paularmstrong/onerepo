import type { Builder, Handler } from '../..';

export const command = 'graph';

export const description = 'Get information about the repository graph';

export const builder: Builder = (yargs) => yargs;

export const handler: Handler = async (argv, { graph }) => {
	const deps = graph.dependents();

	process.stdout.write(JSON.stringify(deps, null, 2));
};
