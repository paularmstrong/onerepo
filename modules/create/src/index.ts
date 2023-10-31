import createYargs from 'yargs/yargs';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import * as command from './command';

const yargs = setupYargs(createYargs(process.argv.slice(2)));

const { emit: originalEmit } = process;

// @ts-ignore Suppressing Experimental warnings from Node
process.emit = (event: string, error: unknown) => {
	if (event === 'warning' && error instanceof Error && error.name === 'ExperimentalWarning') {
		return true;
	}
	return originalEmit.call(
		process,
		// @ts-ignore
		event,
		error,
		// eslint-disable-next-line no-mixed-spaces-and-tabs
	);
};

const { visit } = commandDirOptions({
	// @ts-ignore
	graph: null,
	startup: () => Promise.resolve(),
});

yargs.demandCommand(0).command(visit(command));

yargs.argv;
