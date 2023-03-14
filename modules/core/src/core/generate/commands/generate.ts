import { createRequire } from 'node:module';
import path from 'node:path';
import { glob } from 'glob';
import inquirer from 'inquirer';
import type { Answers, QuestionCollection } from 'inquirer';
import { render } from 'ejs';
import * as file from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { setUpPackageManagerArg } from '@onerepo/yargs';
import type { Builder, Handler, PackageManagerArgs, Yargs } from '@onerepo/yargs';

export const command = ['generate', 'gen'];

export const description = 'Generate files, folders, and workspaces from templates.';

export type Args = PackageManagerArgs & {
	'templates-dir': string;
	type?: string;
};

export const builder: Builder<Args> = (yargs: Yargs<PackageManagerArgs>) =>
	setUpPackageManagerArg(
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
			})
	);

export const handler: Handler<Args> = async function handler(argv, { logger }) {
	const { 'templates-dir': templatesDir, type, 'package-manager': packageManager } = argv;
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

	const { outDir, prompts } = config;

	const vars = await (prompts ? inquirer.prompt(prompts) : {});

	logger.unpause();

	await step.end();

	const files = await glob('**/!(.onegen.*)', { cwd: templateDir, dot: true, nodir: true });

	const renderStep = logger.createStep('Render files');
	for (const filepath of files) {
		const fullpath = path.join(templateDir, filepath);
		let contents = await file.read(fullpath, 'r', { step: renderStep });
		if (fullpath.endsWith('.ejs')) {
			contents = render(contents, vars);
		}
		await file.write(path.join(outDir(vars), render(filepath, vars).replace(/\.ejs$/, '')), contents, {
			step: renderStep,
		});
	}

	await renderStep.end();

	await run({
		name: 'Install dependencies',
		cmd: packageManager === 'yarn' ? 'yarn' : 'npm i',
	});
};

export interface Config<T extends Answers = Record<string, unknown>> {
	outDir: (vars: T) => string;
	prompts?: QuestionCollection<T>;
}

export function getConfig(filepath: string) {
	const require = createRequire('/');
	return require(path.join(filepath, '.onegen')) as Config;
}
