import { start } from '@onerepo/subprocess';
import type { Plugin } from '../../types';
import * as Create from './create';
import * as Init from './init';

export const hooks: Plugin = function hooks(config) {
	return {
		yargs(yargs, visitor) {
			const create = visitor(Create);
			const init = visitor(Init);
			return yargs.command(
				['hooks'],
				'Manage git repository hooks',
				(yargs) => {
					process.env.ONEREPO_SYNC_HOOKS = '0';
					return yargs
						.usage(`$0 hooks <command>`)
						.command(create.command, create.description, create.builder, create.handler)
						.command(init.command, init.description, init.builder, init.handler)
						.default('hooks-path', config.vcs.hooksPath)
						.demandCommand(1);
				},
				() => {},
			);
		},

		shutdown(argv) {
			const noSyncAfter = ['install', 'create'];
			if (
				process.env.CI ||
				process.env.ONEREPO_SPAWN === '1' ||
				process.env.ONEREPO_SYNC_HOOKS === '0' ||
				process.env.ONEREPO_USE_HOOKS === '0' ||
				!config.vcs.autoSyncHooks ||
				(argv._.length && noSyncAfter.includes(argv._[0] as string))
			) {
				return;
			}

			start({
				cmd: process.argv[1],
				args: ['hooks', Init.command[0]],
				opts: {
					detached: true,
				},
			});
		},
	};
};
