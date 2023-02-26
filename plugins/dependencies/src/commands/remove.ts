import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'remove';

export const description = 'Remove dependencies from workspaces.';

type Args = {
	// TODO
} & WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	withWorkspaces(yargs)
		.usage('$0 add -w <workspace(s)> <dependencies> [options]')
		.option('names', {
			alias: ['n', 'name'],
			description: 'One or more dependencies by name',
			type: 'array',
			string: true,
			demandOption: true,
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			demandOption: true,
			string: true,
			description: 'One or more workspaces to add dependencies into',
		});

export const handler: Handler<Args> = async function handler(argv, { logger }) {
	// TODO: do something
	logger.error('Nothing to do');
};
