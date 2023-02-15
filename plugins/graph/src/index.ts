import path from 'node:path';
import type { Config, Plugin } from '@onerepo/cli';

export type Options = {
	name?: string | Array<string>;
	customSchema?: string;
};

export function graph(opts: Options = {}): Plugin {
	const name = opts.name ?? 'graph';
	return (config: Config) => ({
		yargs: (yargs) => {
			const y = yargs
				// false as second arg hides the command from help documentation
				.completion(`${config.name}-completion`, false)
				.command(
					name,
					'Run core graph commands',
					(yargs) =>
						yargs
							.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command>`)
							.commandDir(path.join(__dirname, 'commands'))
							.demandCommand(1),
					() => {}
				);

			if (opts.customSchema) {
				y.default('custom-schema', opts.customSchema);
			}
			return y;
		},
	});
}

export type { SchemaMap } from './schema';
