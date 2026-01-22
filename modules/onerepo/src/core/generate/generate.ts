import path, { dirname } from 'node:path';
import { glob } from 'node:fs/promises';
import pc from 'picocolors';
import inquirer from 'inquirer';
import { render } from 'ejs';
import * as file from '@onerepo/file';
import type { Answers, QuestionCollection } from 'inquirer';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['generate', 'gen'];

export const description = 'Generate files, folders, and Workspaces from templates.';

export type Args = {
	'template-dir': string;
	type?: string;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('type', {
			alias: 't',
			type: 'string',
			description: 'Template type to generate. If not provided, a list will be provided to choose from.',
		})
		.option('template-dir', {
			alias: ['templates-dir'],
			type: 'string',
			normalize: true,
			description: 'Path to the templates',
			default: 'templates',
			hidden: true,
			demandOption: true,
		});

export const handler: Handler<Args> = async function handler(argv, { graph, logger }) {
	const { 'template-dir': templateDir, type } = argv;
	const templateConfigs = glob('*/.onegen.{ts,js,mjs,cjs,cts}', { cwd: templateDir });
	const templates = [];

	for await (const name of templateConfigs) {
		const configFile = path.join(templateDir, name);
		let config = await import(configFile);
		config = config.default ?? config;
		const resolvedName = config.name ?? name.split('/')[0];
		templates.push({
			name: `${resolvedName} ${pc.dim(config.description ?? '')}`,
			value: { config: { name: resolvedName, ...config }, dir: dirname(configFile) },
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
				type.toLowerCase() === config.name?.toLowerCase() ||
				type.toLowerCase() === dir?.split('/')[dir.split('/').length - 1]?.toLowerCase(),
		)?.value;
	}

	if (!template) {
		logger.error(
			`Template does not exist for given type "${type}". Confirm that a configuration file exists at "${templateDir}/${type}/.onegen.js"`,
		);
		return;
	}

	const { config, dir } = template;
	const { outDir, prompts } = config.default ?? config;

	logger.pause();
	const vars = await (prompts ? inquirer.prompt(prompts) : {});
	logger.unpause();

	const files = glob('**/!(.onegen.*)', { cwd: dir, withFileTypes: true, exclude: (file) => file.isDirectory() });
	let possiblyCreatesWorkspace = false;

	const renderStep = logger.createStep('Render files');
	for await (const filedirent of files) {
		const fullpath = path.join(dir, filedirent.name);
		let contents = await file.read(fullpath, 'r', { step: renderStep });
		if (fullpath.endsWith('.ejs')) {
			contents = render(contents, vars);
		}
		const outFile = render(filedirent.name, vars).replace(/\.ejs$/, '');
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

/**
 *
 */
export interface TemplateConfig<T extends Answers = Record<string, unknown>> {
	name?: string;
	description?: string;
	outDir: (vars: T) => string;
	prompts?: QuestionCollection<T>;
}
