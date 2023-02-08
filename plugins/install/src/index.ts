import type { Config, Plugin } from '@onerepo/cli';
import * as cmd from './commands/install';

type Options = {
	name?: string;
};

export function install(opts: Options = {}): Plugin {
	return (config: Config) => ({
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return (
				yargs
					// false as second arg hides the command from help documentation
					.completion(`${config.name}-completion`, false)
					.command(opts.name ?? command, description, (yargs) => builder(yargs).default('name', config.name), handler)
			);
		},
	});
}
