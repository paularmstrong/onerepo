import path from 'node:path';
import { minimatch } from 'minimatch';
import { updateIndex } from '@onerepo/git';
import { exists, lstat, read } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import type { WithAllInputs } from '@onerepo/builders';
import { withAllInputs } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/types';

export const command = 'eslint';

export const description = 'Run eslint across files and workspaces';

type Args = WithAllInputs & {
	add?: boolean;
	cache: boolean;
	extensions: Array<string>;
	fix: boolean;
};

export const builder: Builder<Args> = (yargs) =>
	withAllInputs(yargs)
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write',
			conflicts: ['all'],
		})
		.option('cache', {
			type: 'boolean',
			default: true,
			description: 'Use cache if available',
		})
		.option('fix', {
			type: 'boolean',
			default: true,
			description: 'Apply auto-fixes if possible',
		})
		.option('extensions', {
			type: 'array',
			string: true,
			default: ['js', 'cjs', 'mjs'],
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths, graph, logger }) {
	const { add, all, cache, 'dry-run': isDry, extensions, fix } = argv;

	const filteredPaths = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');
		const ignoreFile = graph.root.resolve('.eslintignore');
		const hasIgnores = await exists(ignoreFile, { step: ignoreStep });
		const rawIgnores = await (hasIgnores ? read(ignoreFile, 'r', { step: ignoreStep }) : '');
		const ignores = rawIgnores.split('\n').filter((line) => Boolean(line.trim()) && !line.trim().startsWith('#'));

		const paths = await getFilepaths();
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

			if (!extensions.includes(ext.replace(/^\./, ''))) {
				continue;
			}

			if (!ignores.some((pattern) => minimatch(filepath, pattern))) {
				filteredPaths.push(filepath);
			}
		}

		await ignoreStep.end();
	}

	if (!all && !filteredPaths.length) {
		logger.warn('No files have been selected to lint. Exiting early.');
		return;
	}

	await run({
		name: `Lint ${all ? '' : filteredPaths.join(', ').substring(0, 40)}…`,
		cmd: 'npx',
		args: [
			'eslint',
			'--ext',
			extensions.join(','),
			cache ? '--cache' : '',
			cache ? '--cache-strategy=content' : '',
			!isDry && fix ? '--fix' : '',
			...(all ? ['.'] : filteredPaths),
		].filter(Boolean),
	});

	if (add && filteredPaths.length) {
		await updateIndex(filteredPaths);
	}
};
