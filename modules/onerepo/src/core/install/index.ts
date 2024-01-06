import type { Plugin } from '../../types';
import * as cmd from './install';

export function install(): Plugin {
	return {
		yargs: (yargs, visitor) => {
			const { command, description, builder, handler } = visitor(cmd);
			return yargs.command(command, description, (yargs) => builder(yargs).usage(`$0 ${command} [options]`), handler);
		},
	};
}
