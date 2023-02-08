import path from 'node:path';
import type { Plugin } from '@onerepo/cli';

type Options = {
	name?: string;
};

export function changesets(opts: Options = {}): Plugin {
	return () => ({
		yargs: (yargs) => {
			return yargs.command(
				opts.name ?? ['changesets', 'change'],
				'Manage changesets',
				(yargs) =>
					yargs
						.usage(`$0 ${opts.name ?? 'changesets'} <command> [options]`)
						.commandDir(path.join(__dirname, 'commands'))
						.demandCommand(1),
				() => {}
			);
		},
	});
}
