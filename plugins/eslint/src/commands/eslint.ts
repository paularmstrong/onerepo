import path from 'node:path';
import { git, logger, run, withAllInputs } from '@onerepo/cli';
import type { Builder, Handler, WithAllInputs } from '@onerepo/cli';

export const command = 'eslint';

export const description = 'Lint files using eslint';

type Args = WithAllInputs & {
	add?: boolean;
	cache: boolean;
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
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths }) {
	const { add, all, cache, 'dry-run': isDry, fix } = argv;

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

const extensions = ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs'];
