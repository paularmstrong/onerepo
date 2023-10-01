import path from 'node:path';
import { minimatch } from 'minimatch';
import * as core from '@actions/core';
import { updateIndex } from '@onerepo/git';
import { exists, lstat, read } from '@onerepo/file';
import * as builders from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'prettier';

export const description = 'Format files with prettier';

type Args = {
	add?: boolean;
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
			description: 'Annotate files in GitHub with errors when failing format checks in GitHub Actions',
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
	const { add, all, check, 'dry-run': isDry, 'github-annotate': github, $0: cmd, _: positionals } = argv;

	const filteredPaths = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');
		const ignoreFile = graph.root.resolve('.prettierignore');
		const hasIgnores = await exists(ignoreFile, { step: ignoreStep });
		const rawIgnores = await (hasIgnores ? read(ignoreFile, 'r', { step: ignoreStep }) : '');
		const ignores = rawIgnores.split('\n').filter((line) => Boolean(line.trim()) && !line.trim().startsWith('#'));

		const paths = await getFilepaths({ step: ignoreStep });
		for (const filepath of paths) {
			const ext = path.extname(filepath);
			if (!ext) {
				const stat = await lstat(graph.root.resolve(filepath), { step: ignoreStep });
				const isDirectory = stat && stat.isDirectory();
				if (isDirectory) {
					filteredPaths.push(filepath);
				}
				continue;
			}

			if (!ignores.some((pattern) => minimatch(filepath, pattern))) {
				filteredPaths.push(filepath);
			}
		}

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
			args: ['--ignore-unknown', isDry || check ? '--list-different' : '--write', ...(all ? ['.'] : filteredPaths)],
			step: runStep,
		});
	} catch (e) {
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
		await updateIndex(filteredPaths);
	}
};
