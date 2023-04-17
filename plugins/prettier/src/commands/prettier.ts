import path from 'node:path';
import { minimatch } from 'minimatch';
import { updateIndex } from '@onerepo/git';
import { exists, lstat, read } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { builders } from '@onerepo/builders';
import { logger } from '@onerepo/logger';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'prettier';

export const description = 'Format files with prettier';

type Args = {
	add?: boolean;
	check?: boolean;
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
		.middleware((argv) => {
			if (argv.add && !('staged' in argv)) {
				argv.staged = true;
			}
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths, graph }) {
	const { add, all, check, 'dry-run': isDry } = argv;

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

	await run({
		name: `Format files ${all ? '' : filteredPaths.join(', ').substring(0, 60)}…`,
		cmd: 'npx',
		args: [
			'prettier',
			'--ignore-unknown',
			isDry || check ? '--list-different' : '--write',
			...(all ? ['.'] : filteredPaths),
		],
	});

	if (add && filteredPaths.length) {
		await updateIndex(filteredPaths);
	}
};
