import path from 'node:path';
import url from 'node:url';
import type { Plugin } from '@onerepo/core';

type Options = {
	name?: string | Array<string>;
};

export function changesets(opts: Options = {}): Plugin {
	const name = opts.name ?? ['change', 'changeset', 'changesets'];
	const dirname = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)));
	return () => ({
		yargs: (yargs) => {
			return yargs.command(
				name,
				'Manage changesets, versioning, and publishing your public workspaces to packages.',
				(yargs) =>
					yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options]`)
						.commandDir(path.join(dirname, 'commands'))
						.demandCommand(1),
				() => {}
			);
		},
	});
}
