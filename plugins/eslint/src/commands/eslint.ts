import path from 'node:path';
import { git, run, withAllInputs } from '@onerepo/cli';
import { logger } from '@onerepo/logger';
import type { Builder, Handler, WithAllInputs } from '@onerepo/cli';

export const command = 'eslint';

export const description = 'Lint files using eslint';

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

export const handler: Handler<Args> = async function handler(argv, { getFilepaths }) {
	const { add, all, cache, 'dry-run': isDry, extensions, fix } = argv;

	const paths = await getFilepaths();
	const filteredPaths = paths.filter((filepath) => {
		const ext = path.extname(filepath);
		return !ext || extensions.includes(ext.replace(/^\./, ''));
	});

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
			!isDry && fix ? '--fix' : '',
			...(all ? ['.'] : filteredPaths),
		].filter(Boolean),
	});

	if (add) {
		await git.updateIndex(paths);
	}
};
