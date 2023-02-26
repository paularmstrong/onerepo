import path from 'node:path';
import type { Plugin } from 'onerepo';

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
 * Include the `dependencies` plugin in your oneRepo plugin setup:
 *
 * @example
 *
 * ```js {3,6}
 * #!/usr/bin/env node
 * import { setup } from 'onerepo';
 * import { dependencies } from '@onerepo/plugin-dependencies';
 *
 * setup({
 * 	plugins: [dependencies()],
 * }).then(({ run }) => run());
 * ```
 */
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
				() => {},
			);
		},
	});
}
