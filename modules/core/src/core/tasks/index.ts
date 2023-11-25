import type { Plugin } from '../../types';
import * as cmd from './commands/tasks';

/**
 * Full configuration options for the Tasks core command.
 * @group Core
 */
export type Options = {
	/**
	 * Array of fileglobs to ignore when calculating the changed workspaces.
	 * @default ['.changesets/*']
	 */
	ignore?: Array<string>;
	/**
	 * Additional lifecycles to make available.
	 */
	lifecycles?: Array<string>;
	/**
	 * Only operate against staged changes for these lifecycles. When set, unstaged changes will be backed up and omitted before determining and running tasks. The unstaged changes will be re-applied after task run completion or SIGKILL event is received.
	 * @default ['pre-commit']
	 */
	stagedOnly?: Array<string>;
};

export function tasks(opts: Options = { lifecycles: [] }): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) => {
					const y = builder(yargs).choices(
						'lifecycle',
						[...(opts.lifecycles || []), ...cmd.lifecycles].filter((v, i, self) => self.indexOf(v) === i),
					);

					if (opts.ignore) {
						y.default('ignore', ['.changesets/*', ...opts.ignore]);
					}

					if (opts.stagedOnly) {
						y.default('staged-only-lifecycles', opts.stagedOnly);
					}
					return y;
				},
				handler,
			);
		},
	};
}
