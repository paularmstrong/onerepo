import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/generate';

type Options = {
	name?: string;
	templatesDir?: string;
};

export function generate(opts: Options = {}): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => {
					const y = builder(yargs)
						.usage(`$0 ${opts.name ?? command} [options]`)
						.default('templates-dir', opts.templatesDir);

					return y;
				},
				handler
			);
		},
	};
}
