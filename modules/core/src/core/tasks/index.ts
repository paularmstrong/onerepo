import type { Plugin } from '../../types';
import * as cmd from './commands/tasks';
import type { TaskConfig } from '@onerepo/graph';
import type { Argv } from '@onerepo/yargs';

/**
 * @group Core
 */
export type Options = {
	ignore?: Array<string>;
	lifecycles?: Array<string>;
};

export function tasks(opts: Options = { lifecycles: [] }, globalTasks?: Array<TaskConfig>): Plugin {
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
						.middleware((argv: Argv) => {
							// TODO: find a better way to pass these through
							// @ts-ignore
							argv.globalTasks = globalTasks;
						})
						.default('ignore', ['.changesets/*', ...(opts.ignore ?? [])]),
				handler
			);
		},
	};
}
