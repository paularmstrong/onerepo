import type { Plugin, RootConfig } from '../../types/index.ts';
import * as cmd from './tasks.ts';

export const tasks: Plugin = function tasks(config: Required<RootConfig>) {
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
							[...(config.taskConfig.lifecycles || []), ...cmd.lifecycles].filter(
								(v, i, self) => self.indexOf(v) === i,
							),
						)
						.middleware((argv: cmd.Argv) => {
							if ((config.taskConfig.stashUnstaged ?? ['pre-commit']).includes(argv.lifecycle)) {
								argv.staged = true;
							}
						});

					if (config.ignore) {
						y.default('ignore', config.ignore);
					}

					return y;
				},
				handler,
			);
		},
	};
};
