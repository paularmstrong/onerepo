import type { Plugin } from '@onerepo/cli';
import * as cmd from './commands/tasks';

export type Options = {
	ignore?: Array<string>;
	lifecycles?: Array<string>;
};

export function tasks(opts: Options = { lifecycles: ['pre-commit', 'pull-request'] }): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) =>
					builder(yargs)
						.choices('lifecycle', opts.lifecycles)
						.default('ignore', ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml', ...(opts.ignore ?? [])]),
				handler
			);
		},
	};
}
