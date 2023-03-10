import { createRequire } from 'node:module';
import path from 'node:path';
import { glob } from 'glob';
import inquirer from 'inquirer';
import type { QuestionCollection } from 'inquirer';
import { render } from 'ejs';
import * as file from '@onerepo/file';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['generate', 'gen'];

export const description = 'Generate workspaces from template directories.';

export type Args = {
	name?: string;
	'templates-dir': string;
	type?: string;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('type', {
			alias: 't',
			type: 'string',
			description: 'Template type to generate. If not provided, a list will be provided to choose from.',
		})
		.option('name', {
			type: 'string',
			description: 'Name of the workspace to generate. If not provided, you will be prompted to enter one later.',
		})
		.option('templates-dir', {
			type: 'string',
			normalize: true,
			description: 'Path to the templates',
			default: 'templates',
			hidden: true,
			demandOption: true,
		});

export const handler: Handler<Args> = async function handler(argv, { logger }) {
	const { 'templates-dir': templatesDir, name: nameArg, type } = argv;
	const templates = await glob('*', { cwd: templatesDir });

	const step = logger.createStep('Get inputs');

	logger.pause();

	let templateType = type;
	if (!templateType) {
		const { templateInput } = await inquirer.prompt([
			{
				name: 'templateInput',
				type: 'list',
				message: 'Choose a template…',
				choices: templates.sort(),
			},
		]);
		templateType = templateInput;
	}

	const templateDir = path.join(templatesDir, templateType!);
	if (!(await file.exists(templateDir, { step }))) {
		step.error(`Template directory does not exist "${templateDir}"`);
		return;
	}

	const [configPath] = await glob(`${path.join(templateDir, '.onegen')}.*`);
	if (!configPath) {
		step.error(`No configuration file found, expected "${path.join(templateDir, '.onegen.cjs')}"`);
		return;
	}

	let config: Config | null;
	if (configPath.endsWith('.cjs')) {
		const require = createRequire('/');
		config = require(configPath);
	} else {
		const { default: importConfig } = await import(configPath);
		config = importConfig;
	}

	if (!config) {
		step.error(`Invalid configuration found at ${configPath}`);
		return;
	}

	const { outDir, nameFormat = (name) => name, dirnameFormat = (name) => name } = config;
	let name = nameArg;
	if (!name) {
		const { nameInput } = await inquirer.prompt([
			{
				name: 'nameInput',
				type: 'input',
				message: 'What name should your package have?',
				transformer: (input: string) => nameFormat(input.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()),
				filter: (input: string) => input.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			},
		]);
		name = nameInput;
	}

	let vars = {};
	if (config.prompts) {
		vars = await inquirer.prompt(config.prompts);
	}

	logger.unpause();

	if (!name) {
		step.error(`No name given for module`);
		await step.end();
		return;
	}

	await step.end();

	const files = await glob('**/!(.onegen.*)', { cwd: templateDir, dot: true, nodir: true });

	const renderStep = logger.createStep('Render files');
	for (const filepath of files) {
		const fullpath = path.join(templateDir, filepath);
		let contents = await file.read(fullpath, 'r', { step: renderStep });
		if (fullpath.endsWith('.ejs')) {
			contents = render(contents, { ...vars, name, fullName: nameFormat(name) });
		}
		await file.write(
			path.join(outDir, dirnameFormat(name), filepath.replace('.ejs', '').replace(/__name__/g, name)),
			contents,
			{ step: renderStep }
		);
	}
	await renderStep.end();
};

export interface Config {
	outDir: string;
	nameFormat?: (name: string) => string;
	dirnameFormat?: (name: string) => string;
	prompts?: QuestionCollection;
}

export function getConfig(filepath: string) {
	const require = createRequire('/');
	return require(path.join(filepath, '.onegen')) as Config;
}
