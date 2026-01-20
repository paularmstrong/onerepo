import path from 'node:path';
import type { Plugin } from '../../types';
import * as Show from './show.ts';
import * as Verify from './verify.ts';

export const graph: Plugin = function graph(opts) {
	let resolvedSchema: string;
	if (opts.validation.schema) {
		if (path.isAbsolute(opts.validation.schema)) {
			throw new Error(
				'Invalid path specified for graph.customSchema. Path must be relative to the repository root, like "./config/graph-schema.ts"',
			);
		}
		resolvedSchema = path.resolve(process.env.ONEREPO_ROOT!, opts.validation.schema);
	}

	return {
		yargs: (yargs, visitor) => {
			const show = visitor(Show);
			const verify = visitor(Verify);
			return yargs.command(
				'graph',
				'Run core Graph commands',
				(yargs) => {
					const y = yargs
						.usage(`$0 graph <command>`)
						.command(show.command, show.description, show.builder, show.handler)
						.command(
							verify.command,
							verify.description,
							(yargs) => {
								const y = verify.builder(yargs);
								if (resolvedSchema) {
									y.default('custom-schema', resolvedSchema);
								}
								y.default('mode', opts.dependencies.mode);
								return y;
							},
							verify.handler,
						)
						.demandCommand(1);

					return y;
				},
				noop,
			);
		},
	};
};

const noop = () => {};

export type { GraphSchemaValidators } from './schema.ts';
