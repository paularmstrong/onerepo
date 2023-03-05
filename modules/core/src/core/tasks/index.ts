import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/tasks';

/**
 * @group Config
 */
export type Options = {
	ignore?: Array<string>;
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
