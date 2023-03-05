import path from 'node:path';
import type { Plugin } from '../../types';
import * as cmd from './commands/generate';

/**
 * @group Core
 */
export type Options = {
	name?: string | Array<string>;
	templatesDir: string;
};

export function generate(opts: Options = { templatesDir: './config/templates' }): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);

			const name = opts.name ?? command;
			return yargs.command(
				opts.name ?? command,
				description,
				(yargs) => {
					const y = builder(yargs)
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`)
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
