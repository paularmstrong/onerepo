import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/docgen';

type Opts = {
	format?: 'markdown' | 'json';
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

			return yargs.command(
				command,
				description,
				(yargs) => {
					const y = builder(yargs);
					if ('outFile' in opts && 'outWorkspace' in opts) {
						y.default('out-file', opts.outFile).default('out-workspace', opts.outWorkspace);
					}
					if (opts.format) {
						y.default('format', opts.format);
					}
					return y;
				},
				handler
			);
		},
	};
}
