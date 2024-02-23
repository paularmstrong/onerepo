import path from 'node:path';
import { minimatch } from 'minimatch';
import { git, file, builders } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = ['eslint', 'lint'];

export const description = 'Run eslint across files and workspaces';

type Args = builders.WithAllInputs & {
	add?: boolean;
	cache: boolean;
	extensions?: Array<string>;
	fix: boolean;
	'github-annotate': boolean;
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
			description: 'Make ESLint check files given these extensions.',
			type: 'array',
			string: true,
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
		.option('github-annotate', {
			description: 'Annotate files in GitHub with errors when failing lint checks in GitHub Actions',
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
	const {
		add,
		all,
		cache,
		'dry-run': isDry,
		extensions,
		fix,
		'github-annotate': github,
		pretty,
		quiet,
		'--': passthrough = [],
	} = argv;

	const filteredPaths = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');
		const ignoreFile = graph.root.resolve('.eslintignore');
		const hasIgnores = await file.exists(ignoreFile, { step: ignoreStep });
		const rawIgnores = await (hasIgnores ? file.read(ignoreFile, 'r', { step: ignoreStep }) : '');
		const ignores = rawIgnores.split('\n').filter((line) => Boolean(line.trim()) && !line.trim().startsWith('#'));

		const paths = await getFilepaths({ step: ignoreStep });
		ignoreStep.debug(paths);
		for (const filepath of paths) {
			const ext = path.extname(filepath);
			if (!ext) {
				const stat = await file.lstat(graph.root.resolve(filepath), { step: ignoreStep });
				const isDirectory = stat && stat.isDirectory();
				if (isDirectory) {
					filteredPaths.push(filepath);
				}
				continue;
			}

			if (extensions && extensions.length && !extensions.includes(ext.replace(/^\./, ''))) {
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

	const args = [pretty ? '--color' : '--no-color'];
	if (extensions && extensions.length) {
		args.push('--ext', extensions.join(','));
	}
	if (!(passthrough.includes('-f') || passthrough.includes('--format'))) {
		args.push('--format', 'onerepo');
	}
	if (cache) {
		args.push('--cache', '--cache-strategy=content');
	}
	if (!isDry && fix) {
		args.push('--fix');
	}
	if (quiet) {
		args.push('--quiet');
	}

	const runStep = logger.createStep('Lint files');
	const [out, err] = await graph.packageManager.run({
		name: `Lint ${all ? '' : filteredPaths.join(', ').substring(0, 40)}…`,
		cmd: 'eslint',
		args: [...args, ...(all ? ['.'] : filteredPaths), ...passthrough],
		opts: {
			env: { ONEREPO_ESLINT_GITHUB_ANNOTATE: github ? 'true' : 'false' },
		},
		step: runStep,
		skipFailures: true,
	});

	if (out) {
		// GitHub needs to read these from the start of the line. The Logger will prefix with ERR by default, so we need to proxy directly to process.stdout instead
		const ghLines = out.match(/^::.*$/gm);
		if (ghLines) {
			process.stdout.write(ghLines.join('\n'));
			process.stdout.write('\n');
		}

		runStep.error(out.replace(/^::.*$/gm, ''));
	}

	// If eslint has an internal or config problem, it logs to stderr, not stdout
	if (err) {
		runStep.error(err);
	}

	await runStep.end();

	if (add && filteredPaths.length) {
		await git.updateIndex(filteredPaths);
	}
};
