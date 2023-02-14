import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/eslint';

type Options = {
	extensions?: Array<string>;
	name?: string | Array<string>;
};

export function eslint(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if (opts.extensions) {
						y.default('extensions', opts.extensions);
					}
					return y;
				},
				handler
			);
		},
	};
}
