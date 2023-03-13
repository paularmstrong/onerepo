import path from 'node:path';
import type { Plugin } from '@onerepo/core';

type Options = {
	name?: string | Array<string>;
};

export function dependencies(opts: Options = {}): Plugin {
	const name = opts.name ?? ['dependencies', 'dependency', 'deps', 'dep'];
	return () => ({
		yargs: (yargs) => {
			return yargs.command(
				name,
				'Safely manager workspace dependencies.',
				(yargs) => {
					return yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options]`)
						.commandDir(path.join(__dirname, 'commands'))
						.demandCommand(1);
				},
				() => {}
			);
		},
	});
}
