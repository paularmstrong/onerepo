import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/prettier';

type Options = {
	name?: string;
};

export function prettier(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => builder(yargs).usage(`$0 ${opts.name ?? command} [options]`),
				handler
			);
		},
	};
}
