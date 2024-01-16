import type { Plugin } from '../../types';
import * as Sync from './sync';
import * as Verify from './verify';

export const codeowners: Plugin = function codeowners(options) {
	return {
		yargs: (yargs, visitor) => {
			const sync = visitor(Sync);
			const verify = visitor(Verify);
			return yargs.command(
				['codeowners', 'owners'],
				'Manage codeowners',
				(yargs) => {
					const y = yargs
						.usage(`$0 codeowners <command>`)
						.command(sync.command, sync.description, sync.builder, sync.handler)
						.command(verify.command, verify.description, verify.builder, verify.handler)
						.default('provider', options.vcs.provider)
						.demandCommand(1);

					return y;
				},
				() => {},
			);
		},
	};
};
