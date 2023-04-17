import path from 'node:path';
import { minimatch } from 'minimatch';
import { updateIndex } from '@onerepo/git';
import { exists, lstat, read } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { builders } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'eslint';

export const description = 'Run eslint across files and workspaces';

type Args = builders.WithAllInputs & {
	add?: boolean;
	cache: boolean;
	extensions: Array<string>;
	fix: boolean;
	pretty: boolean;
	quiet: boolean;
};

export const builder: Builder<Args> = (yargs) =>
	builders
		.withAllInputs(yargs)
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write to the git stage.',
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
		})
		.option('pretty', {
			type: 'boolean',
			default: true,
			description: 'Control ESLint’s `--color` flag.',
		})
		.option('quiet', {
			type: 'boolean',
			description: 'Report errors only',
			default: false,
		})
		.middleware((argv) => {
			if (argv.add && !('staged' in argv)) {
				argv.staged = true;
			}
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths, graph, logger }) {
	const { add, all, cache, 'dry-run': isDry, extensions, fix, pretty, quiet } = argv;

	const filteredPaths = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');
		const ignoreFile = graph.root.resolve('.eslintignore');
		const hasIgnores = await exists(ignoreFile, { step: ignoreStep });
		const rawIgnores = await (hasIgnores ? read(ignoreFile, 'r', { step: ignoreStep }) : '');
		const ignores = rawIgnores.split('\n').filter((line) => Boolean(line.trim()) && !line.trim().startsWith('#'));

		const paths = await getFilepaths({ step: ignoreStep });
		ignoreStep.debug(paths);
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

	const args = ['eslint', '--ext', extensions.join(','), pretty ? '--color' : '--no-color'];
	if (cache) {
		args.push('--cache', '--cache-strategy=content');
	}
	if (!isDry && fix) {
		args.push('--fix');
	}
	if (quiet) {
		args.push('--quiet');
	}
	await run({
		name: `Lint ${all ? '' : filteredPaths.join(', ').substring(0, 40)}…`,
		cmd: 'npx',
		args: [...args, ...(all ? ['.'] : filteredPaths)],
	});

	if (add && filteredPaths.length) {
		await updateIndex(filteredPaths);
	}
};
