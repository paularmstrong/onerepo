import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/prettier';

type Options = {
	name?: string | Array<string>;
};

export function prettier(opts: Options = {}): Plugin {
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
		tasks: {
			'pre-commit': {
				sequential: [`$0 ${opts.name ?? cmd.command[0]} --add`],
			},
			'pre-merge': {
				sequential: [`$0 ${opts.name ?? cmd.command[0]} --check`],
			},
		},
	};
}
