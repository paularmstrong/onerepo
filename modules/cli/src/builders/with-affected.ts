import type { Yargs } from '../yargs';

export const withAffected = <T>(yargs: Yargs<T>): Yargs<T & WithAffected> =>
	yargs
		.option('affected', {
			type: 'boolean',
			description: 'Select all affected workspaces. If no other inputs are chosen, this will default to `true`.',
			conflicts: ['all'],
		})
		.middleware((argv) => {
			if (!('all' in argv || 'files' in argv || 'workspaces' in argv)) {
				// @ts-ignore
				argv.affected = typeof argv.affected === 'boolean' ? argv.affected : true;
			}
		});

export type WithAffected = {
	affected?: boolean;
};
