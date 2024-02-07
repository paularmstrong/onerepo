import { getLogger } from '@onerepo/logger';
import type { Plugin } from 'onerepo';
import * as commands from './commands';

/**
 *
 * ```ts title="onerepo.config.ts"
 * import { changesets } from '@onerepo/plugin-changesets';
 *
 * export default {
 * 	plugins: [
 * 		changesets({
 * 			name: ['change']
 * 		})
 * 	],
 * };
 * ```
 */
export type Options = {
	name?: string | Array<string>;
};

/**
 * Include the `changesets` plugin in your oneRepo plugin setup:
 *
 *
 * ```ts title="onerepo.config.ts" {1,4}
 * import { changesets } from '@onerepo/plugin-changesets';
 *
 * export default {
 * 	plugins: [changesets()],
 * };
 * ```
 */
export function changesets(opts: Options = {}): Plugin {
	const name = opts.name ?? ['change', 'changeset', 'changesets'];
	return {
		yargs: (yargs, visitor) => {
			const resolved = Object.values(commands).map((cmd) => visitor(cmd));
			return yargs.command(
				name,
				'Manage changesets, versioning, and publishing your public Workspaces to packages.',
				(yargs) => {
					yargs.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options...]`).demandCommand(1);

					for (const cmd of resolved) {
						yargs.command(cmd.command, cmd.description, cmd.builder, cmd.handler, [middleware], deprecationNotice);
					}
					return yargs;
				},
				() => {},
				[middleware],
				deprecationNotice,
			);
		},
	};
}

function middleware() {
	const logger = getLogger();
	const v = logger.verbosity;
	logger.verbosity = 2;
	const bar = '⎯'.repeat(Math.min(process.stdout.columns, 100));
	logger.warn(`${bar}\n\n${deprecationNotice}\n\n${bar}`);
	logger.verbosity = v;
}

const deprecationNotice = `The changesets plugin is deprecated in favor of oneRepo’s built-in
\`change\` commands. https://onerepo.tools/core/changes/`;
