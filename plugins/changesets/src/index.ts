import type { Plugin } from '@onerepo/core';
import * as commands from './commands';

/**
 * @example
 *
 * ```js
 * setup({
 * 	plugins: [
 * 		dependencies({
 * 			name: ['changelog']
 * 		}),
 * 	],
 * });
 * ```
 */
export type Options = {
	name?: string | Array<string>;
};

/**
 * Include the `changesets` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { changesets } from '@onerepo/plugin-changesets';
 *
 * setup({
 * 	plugins: [changesets()],
 * }).then(({ run }) => run());
 * ```
 */
export function changesets(opts: Options = {}): Plugin {
	const name = opts.name ?? ['change', 'changeset', 'changesets'];
	return () => ({
		yargs: (yargs, visitor) => {
			const resolved = Object.values(commands).map((cmd) => visitor(cmd));
			return yargs.command(
				name,
				'Manage changesets, versioning, and publishing your public workspaces to packages.',
				(yargs) => {
					yargs.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options]`).demandCommand(1);

					for (const cmd of resolved) {
						yargs.command(cmd.command, cmd.description, cmd.builder, cmd.handler);
					}
					return yargs;
				},
				() => {},
			);
		},
	});
}
