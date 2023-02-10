import path from 'node:path';
import glob from 'glob';
import { existsSync } from 'node:fs';
import { render } from 'ejs';
import { file, logger } from '@onerepo/cli';
import type { Builder, Handler } from '@onerepo/cli';

export const command = ['generate', 'gen'];

export const description = 'Generate workspaces from standard templates';

type Args = {
	name: string;
	'templates-dir': string;
	type: string;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('type', {
			alias: 't',
			type: 'string',
			description: 'Template type to generate',
			demandOption: true,
		})
		.option('name', {
			type: 'string',
			description: 'Name of the workspace to generate',
			demandOption: true,
		})
		.option('templates-dir', {
			type: 'string',
			normalize: true,
			description: 'Path to the templates',
			default: 'templates',
			hidden: true,
		})
		.middleware((argv) => {
			if (!existsSync(path.join(argv['templates-dir'], argv.type))) {
				yargs.showHelp();
				const msg = `Unable to find template type "${argv.type}"`;
				logger.error(msg);
				yargs.exit(1, new Error(msg));
			}
		});

export const handler: Handler<Args> = async function handler(argv, { logger }) {
	const { 'templates-dir': templatesDir, name } = argv;

	const templateDir = path.join(templatesDir, 'plugin');

	let config: Config | void;
	try {
		config = require(path.join(templateDir, '.onegen.cjs'));
	} catch (e) {
		logger.error(`Unable to load configuration file "${path.join(templateDir, '.onegen.cjs')}"`);
		logger.error(e);
		return;
	}

	const { outDir, nameFormat, dirnameFormat } = config!;
	const files = glob.sync('**/!(.genconf)', { cwd: templateDir, nodir: true });

	const step = logger.createStep('Render files');
	for (const filepath of files) {
		const fullpath = path.join(templateDir, filepath);

		let contents = await file.read(fullpath, 'r', { step });
		if (fullpath.endsWith('.ejs')) {
			contents = render(contents, { name, fullName: nameFormat(name) });
		}

		await file.write(
			path.join(outDir, dirnameFormat(name), filepath.replace('.ejs', '').replace(/__name__/g, name)),
			contents,
			{ step }
		);
	}
};

interface Config {
	outDir: string;
	nameFormat: (name: string) => string;
	dirnameFormat: (name: string) => string;
}
