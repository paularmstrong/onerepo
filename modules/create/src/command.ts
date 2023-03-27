import path from 'node:path';
import inquirer from 'inquirer';
import { write } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = '$0';
export const description = 'Sets up oneRepo in a new or existing repository';

type Argv = {
	location?: string;
	name?: string;
	workspaces?: Array<string>;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.option('location', {
			type: 'string',
			description: 'Path relative to the process working directory to initialize oneRepo',
		})
		.option('name', {
			type: 'string',
			description: 'The name of your CLI',
			default: 'one',
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of glob locations for workspaces',
		});

export const handler: Handler<Argv> = async (argv, { logger }) => {
	const { location, name: inputName, workspaces: inputWorkspaces } = argv;
	const prompts = await inquirer.prompt([
		{
			name: 'dir',
			type: 'input',
			message: 'Where would you like to initialize oneRepo?',
			when: () => !location,
			suffix: ` ${process.cwd()}/`,
			filter: (input) => path.join(process.cwd(), input),
		},
		{
			name: 'name',
			type: 'input',
			message: 'What’s the name of your CLI?',
			default: inputName,
		},
		{
			name: 'workspaces',
			type: 'input',
			message: 'Enter a comma-separated list of locations for workspaces:',
			default: 'apps/*,modules/*',
			when: () => !inputWorkspaces,
		},
	]);

	const outdir = prompts.dir ?? path.join(process.cwd(), location || '.');
	const name = prompts.name ?? inputName;
	const workspaces: Array<string> = prompts.workspaces ? prompts.workspaces.split(',') : inputWorkspaces;
	logger.debug({ outdir, name, workspaces });

	await write(
		path.join(outdir, 'package.json'),
		JSON.stringify({
			name,
			private: true,
			type: 'module',
			dependencies: {
				onerepo: 'latest',
			},
			workspaces: workspaces.map((ws) => (/\/\*?$/.test(ws) ? ws : `${ws}/*`)),
		})
	);

	await write(
		path.join(outdir, 'bin', `${name}.mjs`),
		`#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setup } from 'onerepo';

setup({
  name: '${name}',
  root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
}).then(({ run }) => run());`
	);

	await run({
		name: 'Initialize Git',
		cmd: 'git',
		args: ['init'],
		opts: {
			cwd: outdir,
		},
	});
};
