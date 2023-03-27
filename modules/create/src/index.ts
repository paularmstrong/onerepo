import createYargs from 'yargs/yargs';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import * as command from './command';

const yargs = setupYargs(createYargs(process.argv.slice(2)));

const { visit } = commandDirOptions({
	// @ts-ignore
	graph: null,
	preHandler: async () => {},
	postHandler: async () => {},
});

yargs.demandCommand(0).command(visit(command));

yargs.argv;
