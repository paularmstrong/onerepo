import type { Plugin } from '../../types';
import * as Show from './commands/show';
import * as Verify from './commands/verify';

/**
 * @group Core
 */
export type Options = {
	name?: string | Array<string>;
	customSchema?: string;
};

export function graph(opts: Options = {}): Plugin {
	const name = opts.name ?? 'graph';
	return () => ({
		yargs: (yargs, visitor) => {
			const show = visitor(Show);
			const verify = visitor(Verify);
			return yargs.command(
				name,
				'Run core graph commands',
				(yargs) => {
					const y = yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command>`)
						.command(show.command, show.description, show.builder, show.handler)
						.command(verify.command, verify.description, verify.builder, verify.handler)
						.demandCommand(1);

					if (opts.customSchema) {
						y.default('custom-schema', opts.customSchema);
					}
					return y;
				},
				noop
			);
		},
	});
}

const noop = () => {};

export type { GraphSchemaValidators } from './schema';
