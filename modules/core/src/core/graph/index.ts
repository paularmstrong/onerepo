import path from 'node:path';
import url from 'node:url';
import type { Config, Plugin } from '../../types';

/**
 * @group Core
 */
export type Options = {
	name?: string | Array<string>;
	customSchema?: string;
};

export function graph(opts: Options = {}): Plugin {
	const name = opts.name ?? 'graph';
	const dirname = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)));
	return (config: Config) => ({
		yargs: (yargs) =>
			yargs
				// false as second arg hides the command from help documentation
				.completion(`${config.name}-completion`, false)
				.command(
					name,
					'Run core graph commands',
					(yargs) => {
						const y = yargs
							.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command>`)
							.commandDir(path.join(dirname, 'commands'))
							.demandCommand(1);
						if (opts.customSchema) {
							y.default('custom-schema', opts.customSchema);
						}
						return y;
					},
					() => {}
				),
	});
}

export type { GraphSchemaValidators } from './schema';
