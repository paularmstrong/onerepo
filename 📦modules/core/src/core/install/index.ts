import type { Config, Plugin } from '../../types';
import * as cmd from './commands/install';

/**
 * Full configuration options for the Graph core command.
 * @group Core
 */
export type Options = {
	/**
	 * Override the name of the command.
	 * @default `'install'`
	 */
	name?: string | Array<string>;
};

export function install(opts: Options = {}): Plugin {
	return (config: Config) => ({
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const name = opts.name ?? command;
			return yargs.command(
				name,
				description,
				(yargs) =>
					builder(yargs)
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} [options]`)
						.default('name', config.name),
				handler
			);
		},
	});
}
