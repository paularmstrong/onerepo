import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/vitest';

type Options = {
	config?: string;
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
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if (opts.config) {
						y.default('config', opts.config);
					}
					return y;
				},
				handler
			);
		},
	};
}
