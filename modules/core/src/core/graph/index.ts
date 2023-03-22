import type { Plugin } from '../../types';
import * as Show from './commands/show';
import * as Verify from './commands/verify';

/**
 * Full configuration options for the Graph core command.
 * @group Core
 */
export type Options = {
	/**
	 * Override the name of the command.
	 * @default `'graph'`
	 */
	name?: string | Array<string>;
	/**
	 * File path to a custom schema for the `verify` command.
	 */
	customSchema?: string;
	/**
	 * Method for dependency verification.
	 * @default `'loose'`
	 */
	dependencies?: 'loose' | 'off';
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
						.command(
							verify.command,
							verify.description,
							(yargs) => {
								const y = verify.builder(yargs);
								if (opts.customSchema) {
									y.default('custom-schema', opts.customSchema);
								}
								if (opts.dependencies) {
									y.default('dependencies', opts.dependencies);
								}
								return y;
							},
							verify.handler
						)
						.demandCommand(1);

					return y;
				},
				noop
			);
		},
	});
}

const noop = () => {};

export type { GraphSchemaValidators } from './schema';
