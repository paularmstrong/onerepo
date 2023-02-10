import path from 'node:path';
import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/generate';

type Options = {
	name?: string;
	templatesDir: string;
};

export function generate(opts: Options): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => {
					const y = builder(yargs)
						.usage(`$0 ${opts.name ?? command} [options]`)
						.default('templates-dir', opts.templatesDir ?? '')
						.epilogue(
							`To create new templates add a new folder to ${path.relative(
								process.cwd(),
								opts.templatesDir
							)} and create a \`.onegen.cjs\` configuration file. Follow the instructions online for more: https://onerepo.tools/docs/plugins/generate/`
						);

					return y;
				},
				handler
			);
		},
	};
}
