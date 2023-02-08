import type { Yargs } from '../yarg-types';

export const withWorkspaces = <T>(yargs: Yargs<T>): Yargs<T & WithWorkspaces> =>
	yargs
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Run across all workspaces',
			conflicts: ['affected', 'workspaces'],
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of workspace names to run against',
			conflicts: ['all'],
		});

export type WithWorkspaces = {
	all?: boolean;
	workspaces?: Array<string>;
};
