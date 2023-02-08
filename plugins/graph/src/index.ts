import path from 'node:path';
import type { Config, Plugin } from '@onerepo/cli';

type Options = {
	name?: string;
};

export function graph(opts: Options = {}): Plugin {
	return (config: Config) => ({
		yargs: (yargs) => {
			return (
				yargs
					// false as second arg hides the command from help documentation
					.completion(`${config.name}-completion`, false)
					.command(
						opts.name ?? 'graph',
						'Run core graph commands',
						(yargs) => yargs.commandDir(path.join(__dirname, 'commands')).demandCommand(1),
						() => {}
					)
			);
		},
	});
}
