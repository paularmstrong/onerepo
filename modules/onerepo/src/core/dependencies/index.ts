import type { Plugin } from 'onerepo';
import * as Add from './add.ts';
import * as Remove from './remove.ts';
import * as Verify from './verify.ts';

export const dependencies: Plugin = function dependencies(opts) {
	const name = ['dependencies', 'dependency', 'deps', 'dep'];
	return {
		yargs: (yargs, visitor) => {
			const add = visitor(Add);
			const remove = visitor(Remove);
			const verify = visitor(Verify);
			return yargs.command(
				name,
				'Safely manage Workspace dependencies across your repository.',
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
						.command(
							verify.command,
							verify.description,
							(yargs) => verify.builder(yargs).default('dedupe', opts.dependencies.dedupe),
							verify.handler,
						)
						.demandCommand(1);
				},
				() => {},
			);
		},
	};
};
