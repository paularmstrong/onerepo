import type { Plugin } from '@onerepo/core';
import * as cmd from './commands/docgen';

type Opts = {
	format?: 'markdown' | 'json';
	name?: string | Array<string>;
	safeWrite?: boolean;
};

type OptionsStdout = Opts;

type OptionsFile = {
	outFile: string;
	outWorkspace: string;
} & Opts;

export function docgen(opts: OptionsStdout | OptionsFile = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;

			return yargs.command(
				command,
				description,
				(yargs) => {
					const y = builder(yargs).usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`);
					if ('outFile' in opts && 'outWorkspace' in opts) {
						y.default('out-file', opts.outFile).default('out-workspace', opts.outWorkspace);
					}
					if (opts.format) {
						y.default('format', opts.format);
					}
					if ('safeWrite' in opts) {
						y.default('safe-write', opts.safeWrite);
					}
					return y;
				},
				handler
			);
		},
	};
}
