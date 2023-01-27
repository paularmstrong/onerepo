import path from 'path';
import type { Builder } from '..';

export const command = 'info';

export const description = 'Get information about the repository';

export const builder: Builder = (yargs) =>
	yargs.commandDir(path.join(__dirname, 'info')).demandCommand(1, 'Please enter a command.');
