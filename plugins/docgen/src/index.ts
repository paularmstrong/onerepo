import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/docgen';

type Opts = {
	format?: 'markdown' | 'json';
};

type OptionsStdout = {
	outFile: never;
	outWorkspace: never;
} & Opts;

type OptionsFile = {
	outFile: string;
	outWorkspace: string;
} & Opts;

export function docgen(opts: OptionsStdout | OptionsFile): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);

			return yargs.command(
				command,
				description,
				(yargs) =>
					builder(yargs)
						.default('out-file', opts.outFile)
						.default('out-workspace', opts.outWorkspace)
						.default('format', opts.format),
				handler
			);
		},
	};
}
