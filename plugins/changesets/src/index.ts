import path from 'node:path';
import type { Plugin } from '@onerepo/cli';

type Options = {
	name?: string | Array<string>;
};

export function changesets(opts: Options = {}): Plugin {
	const name = opts.name ?? ['changesets', 'change'];
	return () => ({
		yargs: (yargs) => {
			return yargs.command(
				name,
				'Manage changesets',
				(yargs) =>
					yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options]`)
						.commandDir(path.join(__dirname, 'commands'))
						.demandCommand(1),
				() => {}
			);
		},
	});
}
