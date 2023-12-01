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
	 * Default to use `--staged` behavior for these lifecycles. When set, unstaged changes will be backed up and omitted before determining and running tasks. The unstaged changes will be re-applied after task run completion or SIGKILL event is received.
	 *
	 * Note that it is still important to include `--staged` in individual tasks to run in the `onerepo.config` files.
	 *
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
					const y = builder(yargs)
						.choices(
							'lifecycle',
							[...(opts.lifecycles || []), ...cmd.lifecycles].filter((v, i, self) => self.indexOf(v) === i),
						)
						.middleware((argv: cmd.Argv) => {
							if ((opts.stagedOnly || ['pre-commit']).includes(argv.lifecycle)) {
								argv.staged = true;
							}
						});

					if (opts.ignore) {
						y.default('ignore', ['.changesets/*', ...opts.ignore]);
					}

					return y;
				},
				handler,
			);
		},
	};
}
