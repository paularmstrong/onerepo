import createYargs from 'yargs/yargs';
import { commandDirOptions, setupYargs } from '@onerepo/yargs';
import { getLogger } from '@onerepo/logger';
import * as command from './command';

const logger = getLogger();
const yargs = setupYargs(createYargs(process.argv.slice(2)), { logger });

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
	);
};

const { visit } = commandDirOptions({
	// @ts-ignore
	graph: null,
	startup: () => Promise.resolve(),
	logger,
});

yargs.demandCommand(0).command(visit(command));

yargs.argv;
