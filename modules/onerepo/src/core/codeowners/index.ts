import type { Plugin } from '../../types';
import * as Sync from './commands/sync';
import * as Verify from './commands/verify';
import type { Providers } from './get-codeowners';

/**
 * Full configuration options for the Codeowners core command.
 * @group Core
 *
 * @example Configuration
 * ```ts title="./onerepo.config.ts"
 * export default {
 * 	core: {
 *  	codeowners: {
 * 			provider: 'github'
 * 		}
 * 	}
 * }
 * ```
 */
export type Options = {
	/**
	 * Repository host/provider. This determines where and how codeowners files will be written
	 * @default `'github'`
	 */
	provider?: Providers;
};

export function codeowners({ provider = 'github' }: Options = {}): Plugin {
	return () => ({
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
						.default('provider', provider)
						.demandCommand(1);

					return y;
				},
				() => {},
			);
		},
	});
}
