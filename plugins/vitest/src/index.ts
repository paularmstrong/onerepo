import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/vitest';

type Options = {
	name?: string | Array<string>;
};

export function vitest(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`),
				handler
			);
		},
	};
}
