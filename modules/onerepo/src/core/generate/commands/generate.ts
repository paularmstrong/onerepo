import { createRequire } from 'node:module';
import path from 'node:path';
import pc from 'picocolors';
import { glob } from 'glob';
import inquirer from 'inquirer';
import { render } from 'ejs';
import * as file from '@onerepo/file';
import type { Answers, QuestionCollection } from 'inquirer';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['generate', 'gen'];

export const description = 'Generate files, folders, and workspaces from templates.';

export type Args = {
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
		.option('templates-dir', {
			type: 'string',
			normalize: true,
			description: 'Path to the templates',
			default: 'templates',
			hidden: true,
			demandOption: true,
		});

export const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
	const { 'templates-dir': templatesDir, type } = argv;
	const step = logger.createStep('Get template');
	const templateConfigs = await glob('*/.onegen.{js,cjs,mjs}', { cwd: templatesDir });
	const templates = [];
	for (const name of templateConfigs) {
		const dir = path.join(templatesDir, name);
		const config = await loadConfig(dir);
		const resolvedName = config.name ?? name.split('/')[0];
		templates.push({
			name: `${resolvedName} ${pc.dim(config.description ?? '')}`,
			value: { config: { name: resolvedName, ...config }, dir: dir.split('/.onegen')[0] },
		});
	}

	const compare = new Intl.Collator('en').compare;

	let template;
	if (!type) {
		logger.pause();
		const { templateInput } = await inquirer.prompt([
			{
				name: 'templateInput',
				type: 'list',
				message: 'Choose a template…',
				choices: templates.sort((a, b) => compare(a.name, b.name)),
			},
		]);
		template = templateInput;
		logger.unpause();
	} else {
		template = templates.find(
			({ value: { config, dir } }) =>
				type.toLowerCase() === config.name.toLowerCase() ||
				type.toLowerCase() === dir.split('/')[dir.split('/').length - 1].toLowerCase(),
		)?.value;
	}

	if (!template) {
		step.error(
			`Template does not exist for given type "${type}". Confirm that a configuration file exists at "${templatesDir}/${type}/.onegen.js"`,
		);
		return;
	}

	const {
		config: { outDir, prompts },
		dir,
	} = template;

	logger.pause();

	const vars = await (prompts ? inquirer.prompt(prompts) : {});

	logger.unpause();

	await step.end();

	const files = await glob('**/!(.onegen.*)', { cwd: dir, dot: true, nodir: true });
	let possiblyCreatesWorkspace = false;

	const renderStep = logger.createStep('Render files');
	for (const filepath of files) {
		const fullpath = path.join(dir, filepath);
		let contents = await file.read(fullpath, 'r', { step: renderStep });
		if (fullpath.endsWith('.ejs')) {
			contents = render(contents, vars);
		}
		const outFile = render(filepath, vars).replace(/\.ejs$/, '');
		possiblyCreatesWorkspace = possiblyCreatesWorkspace || outFile.endsWith('package.json');
		await file.write(path.join(outDir(vars), outFile), contents, {
			step: renderStep,
		});
	}
	await renderStep.end();

	if (possiblyCreatesWorkspace) {
		await graph.packageManager.install();
	}
};

export interface Config<T extends Answers = Record<string, unknown>> {
	name?: string;
	description?: string;
	outDir: (vars: T) => string;
	prompts?: QuestionCollection<T>;
}

async function loadConfig(configPath: string) {
	let config: Config | null;
	if (configPath.endsWith('.cjs')) {
		const require = createRequire('/');
		config = require(configPath);
	} else {
		const { default: importConfig } = await import(configPath);
		config = importConfig;
	}

	if (!config) {
		throw new Error(`Invalid configuration found at ${configPath}`);
	}
	return config;
}
