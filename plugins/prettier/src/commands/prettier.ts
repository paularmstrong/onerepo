import path from 'node:path';
import ignore from 'ignore';
import * as core from '@actions/core';
import { git, file, builders } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = ['prettier', 'format'];

export const description = 'Format files with prettier';

type Args = {
	add?: boolean;
	cache: boolean;
	check?: boolean;
	'github-annotate': boolean;
} & builders.WithAllInputs;

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAllInputs(yargs)
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write',
			conflicts: ['all', 'check'],
		})
		.option('check', {
			description: 'Check for changes.',
			type: 'boolean',
		})
		.option('github-annotate', {
			description: 'Annotate files in GitHub with errors when failing format checks in GitHub Actions.',
			type: 'boolean',
			default: true,
			hidden: true,
		})
		.option('cache', {
			description: 'Use Prettier’s built-in cache to determin whether files need formatting or not.',
			type: 'boolean',
			default: true,
			hidden: true,
		})
		.middleware((argv) => {
			if (argv.add && !('staged' in argv)) {
				argv.staged = true;
			}
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths, graph, logger }) {
	const { add, all, cache, check, 'dry-run': isDry, 'github-annotate': github, $0: cmd, _: positionals } = argv;

	let filteredPaths: Array<string> = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');
		const ignoreFile = graph.root.resolve('.prettierignore');
		const hasIgnores = await file.exists(ignoreFile, { step: ignoreStep });
		const rawIgnores = await (hasIgnores ? file.read(ignoreFile, 'r', { step: ignoreStep }) : '');
		const ignores = rawIgnores.split('\n').filter((line) => Boolean(line.trim()) && !line.trim().startsWith('#'));

		const matcher = ignore().add(ignores);
		const paths = await getFilepaths({ step: ignoreStep });
		filteredPaths = matcher.filter(paths.map((p) => (path.isAbsolute(p) ? graph.root.relative(p) : p)));

		await ignoreStep.end();
	}

	if (!all && !filteredPaths.length) {
		logger.warn('No filepaths to check for formatting');
		return;
	}

	const runStep = logger.createStep('Format files');
	try {
		await graph.packageManager.run({
			name: `Format files ${all ? '' : filteredPaths.join(', ').substring(0, 60)}…`,
			cmd: 'prettier',
			args: [
				'--ignore-unknown',
				isDry || check ? '--list-different' : '--write',
				...(cache ? ['--cache', '--cache-strategy', 'content'] : []),
				...(all ? ['.'] : filteredPaths),
			],
			step: runStep,
		});
	} catch (e) {
		runStep.error(e);
		const files = (e instanceof Error ? e.message : `${e}`).trim().split('\n');
		const err = `The following files were not properly formatted.

${files.map((f) => `  - ${f}`).join('\n')}

To resolve the issue, run Prettier formatting and commit the resulting changes:

  $ ${cmd} ${positionals[0]}
	`;

		if (process.env.GITHUB_RUN_ID && github) {
			const msg = `This file needs formatting. Fix by running \`${cmd} ${positionals[0]}\``;
			files.forEach((file) => core.error(msg, { file }));
		}

		runStep.error(err);
		await runStep.end();
		return;
	}
	await runStep.end();

	if (add && filteredPaths.length) {
		await git.updateIndex(filteredPaths);
	}
};
