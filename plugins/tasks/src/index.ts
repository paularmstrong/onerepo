import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/tasks';

type Options = {
	lifecycles: Array<string>;
};

export function tasks(opts: Options): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) => builder(yargs).choices('lifecycle', opts.lifecycles),
				handler
			);
		},
	};
}
