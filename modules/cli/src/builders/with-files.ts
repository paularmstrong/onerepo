import type { Yargs } from '../yarg-types';

export const withFiles = <T>(yargs: Yargs<T>): Yargs<T & WithFiles> =>
	yargs.option('files', {
		alias: 'f',
		type: 'array',
		string: true,
		description: 'Determine workspaces from specific files',
		conflicts: ['all', 'workspaces'],
	});

export type WithFiles = {
	files?: Array<string>;
};
