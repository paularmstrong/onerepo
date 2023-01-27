import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/vitest';

type Options = {
	name: string;
};

export function vitest(opts: Options): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(opts.name ?? command, description, builder, handler);
		},
	};
}
