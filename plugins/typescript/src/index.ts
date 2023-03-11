import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/typescript';

type Options = {
	name?: string;
	tsconfig?: string;
};

export function typescript(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if (opts.tsconfig) {
						y.default('tsconfig', opts.tsconfig);
					}
					return y;
				},
				handler
			);
		},
		tasks: {
			'pre-commit': {
				sequential: [`$0 ${opts.name ?? cmd.command[0]}`],
			},
			'pre-merge': {
				sequential: [`$0 ${opts.name ?? cmd.command[0]}`],
			},
		},
	};
}
