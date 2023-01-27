import type { Config, Plugin } from '@onerepo/cli';
import * as cmd from './commands/install';

type Options = {
	commandName?: string;
};

export function install(opts: Options = {}): Plugin {
	return (config: Config) => ({
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			const { commandName = command } = opts;
			return (
				yargs
					// false as second arg hides the command from help documentation
					.completion(`${config.name}-completion`, false)
					.command(commandName, description, (yargs) => builder(yargs).default('name', config.name), handler)
			);
		},
	});
}
