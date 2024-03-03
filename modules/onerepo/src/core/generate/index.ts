import path from 'node:path';
import type { Plugin } from '../../types';
import * as cmd from './generate';

export const generate: Plugin = function generate(opts) {
	if (path.isAbsolute(opts.templateDir)) {
		throw new Error(
			'Invalid path specified for `core.generate.templatesDir`. Path must be relative to the repository root, like "./config/templates"',
		);
	}
	const resolvedDir = path.resolve(process.env.ONEREPO_ROOT!, opts.templateDir ?? '');

	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);

			return yargs.command(
				command,
				description,
				(yargs) => {
					const y = builder(yargs)
						.usage(`$0 ${Array.isArray(command) ? command[0] : command} [options...]`)
						.default('templates-dir', resolvedDir)
						.epilogue(
							`To create new templates add a new folder to ${path.relative(
								process.env.ONEREPO_ROOT!,
								resolvedDir,
							)} and create a \`.onegen.cjs\` configuration file. Follow the instructions online for more: https://onerepo.tools/core/generate/`,
						);

					return y;
				},
				handler,
			);
		},
	};
};
