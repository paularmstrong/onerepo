import type { Plugin } from '../../types';
import * as cmd from './commands/tasks';

/**
 * Full configuration options for the Tasks core command.
 * @group Core
 */
export type Options = {
	/**
	 * Array of fileglobs to ignore when calculating the changed workspaces.
	 * @example `['**\/README']`
	 */
	ignore?: Array<string>;
	/**
	 * Additional lifecycles to make available.
	 */
	lifecycles?: Array<string>;
};

export function tasks(opts: Options = { lifecycles: [] }): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) =>
					builder(yargs)
						.choices(
							'lifecycle',
							[...(opts.lifecycles || []), ...cmd.lifecycles].filter((v, i, self) => self.indexOf(v) === i)
						)
						.default('ignore', ['.changesets/*', ...(opts.ignore ?? [])]),
				handler
			);
		},
	};
}
