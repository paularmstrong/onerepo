import path from 'node:path';
import inquirer from 'inquirer';
import { exists, read, write } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { getPackageManager, getPackageManagerName } from '@onerepo/package-manager';
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
	const { dir } = await inquirer.prompt([
		{
			name: 'dir',
			type: 'input',
			message: 'Where would you like to initialize oneRepo?',
			when: () => !location,
			suffix: ` ${process.cwd()}/`,
			filter: (input) => path.join(process.cwd(), input),
		},
	]);

	const outdir = dir ?? path.join(process.cwd(), location || '.');
	const isExistingRepo = await exists(path.join(outdir, 'package.json'));
	let pkgManager: 'npm' | 'pnpm' | 'yarn' = 'npm';
	let packageJson = {};
	if (isExistingRepo) {
		const raw = await read(path.join(outdir, 'package.json'));
		packageJson = JSON.parse(raw);
		pkgManager = getPackageManagerName(outdir, 'packageManager' in packageJson ? `${packageJson.packageManager}` : '');
	}

	const prompts = await inquirer.prompt([
		{
			name: 'pkgmanager',
			type: 'choice',
			message: 'Which package manager would you like to use?',
			choices: ['npm', 'pnpm', 'yarn'],
			when: () => !isExistingRepo,
		},
		{
			name: 'name',
			type: 'input',
			message: 'What would you like to name the repository’s CLI?',
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

	pkgManager = prompts.pkgmanager ?? pkgManager;
	const manager = getPackageManager(pkgManager);
	const name = prompts.name ?? inputName;
	const workspaces: Array<string> = prompts.workspaces ? prompts.workspaces.split(',') : inputWorkspaces;

	logger.debug({ outdir, name, workspaces });

	const pluginSearch = await fetch(
		new URL(
			`/-/v1/search?${new URLSearchParams({ text: '@onerepo/plugin-' }).toString()}`,
			'https://registry.npmjs.org'
		),
		{}
	);
	const { objects: plugins } = await pluginSearch.json();

	await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'plugins',
			message: 'Which plugins should be included?',
			choices: plugins.map(({ package: { name, version } }) => ({
				value: { name, version },
				name,
			})),
		},
	]);

	await write(
		path.join(outdir, 'package.json'),
		JSON.stringify({
			name,
			private: true,
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

setup(
	/** @type import('onerepo').Config */
	{
		name: '${name}',
		root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
	}
).then(({ run }) => run());`
	);

	await run({
		name: 'Initialize Git',
		cmd: 'git',
		args: ['init'],
		opts: {
			cwd: outdir,
		},
	});

	await manager.install();
};
