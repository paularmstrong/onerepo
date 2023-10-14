import path from 'node:path';
import type { Plugin } from '../../types';
import * as cmd from './commands/generate';

/**
 * Full configuration options for the Generate core command.
 * @group Core
 */
export type Options = {
	/**
	 * Override the name of the command.
	 * @default `['generate', 'gen]`
	 */
	name?: string | Array<string>;
	/**
	 * Folder path to find templates.
	 */
	templatesDir: string;
};

export function generate(opts: Options = { templatesDir: './config/templates' }): Plugin {
	if (path.isAbsolute(opts.templatesDir)) {
		throw new Error(
			'Invalid path specified for `core.generate.templatesDir`. Path must be relative to the repository root, like "./config/templates"',
		);
	}
	const resolvedDir = path.resolve(process.env.ONE_REPO_ROOT!, opts.templatesDir ?? '');

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
						.default('templates-dir', resolvedDir)
						.epilogue(
							`To create new templates add a new folder to ${path.relative(
								process.env.ONE_REPO_ROOT!,
								resolvedDir,
							)} and create a \`.onegen.cjs\` configuration file. Follow the instructions online for more: https://onerepo.tools/docs/plugins/generate/`,
						);

					return y;
				},
				handler,
			);
		},
	};
}
