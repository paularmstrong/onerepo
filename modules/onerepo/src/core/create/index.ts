import type { Plugin } from '../../types';
import * as cmd from './create';

export const create: Plugin = function create() {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(
				command,
				description,
				(yargs) => builder(yargs).usage(`$0 ${command[0]} [options...]`),
				handler,
			);
		},
	};
};
