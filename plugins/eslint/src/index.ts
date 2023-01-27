import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/eslint';

type Options = {
	name: string;
};

export function eslint(opts: Options): Plugin {
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
