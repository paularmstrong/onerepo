import type { Plugin } from 'onerepo';
import * as Add from './add';
import * as Remove from './remove';

export const dependencies: Plugin = function dependencies(opts) {
	const name = ['dependencies', 'dependency', 'deps', 'dep'];
	return {
		yargs: (yargs, visitor) => {
			const add = visitor(Add);
			const remove = visitor(Remove);
			return yargs.command(
				name,
				'Safely manager workspace dependencies.',
				(yargs) => {
					return yargs
						.usage(`$0 ${Array.isArray(name) ? name[0] : name} <command> [options...]`)
						.command(
							add.command,
							add.description,
							(yargs) => add.builder(yargs).default('dedupe', opts.dependencies.dedupe),
							add.handler,
						)
						.command(
							remove.command,
							remove.description,
							(yargs) => remove.builder(yargs).default('dedupe', opts.dependencies.dedupe),
							remove.handler,
						)
						.demandCommand(1);
				},
				() => {},
			);
		},
	};
};
