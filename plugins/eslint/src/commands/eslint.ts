import { git, builders } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = ['eslint', 'lint'];

export const description = 'Run eslint across files and Workspaces.';

type Args = builders.WithAllInputs & {
	add?: boolean;
	cache: boolean;
	fix: boolean;
	'github-annotate': boolean;
	pretty: boolean;
	warnings: boolean;
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
		.option('pretty', {
			type: 'boolean',
			default: true,
			description: 'Control ESLint’s `--color` flag.',
		})
		.option('warnings', {
			alias: ['warn'],
			type: 'boolean',
			description: 'Report warnings from ESLint.',
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
		fix,
		'github-annotate': github,
		pretty,
		warnings,
		'--': passthrough = [],
	} = argv;

	let filteredPaths: Array<string> = [];
	if (!all) {
		const filesStep = logger.createStep('Getting files');

		const paths = await getFilepaths({ step: filesStep });
		filteredPaths = paths.includes('.') ? ['.'] : paths;

		await filesStep.end();
	}

	if (!all && !filteredPaths.length) {
		logger.warn('No files have been selected to lint. Exiting early.');
		return;
	}

	const args = [pretty ? '--color' : '--no-color'];

	if (!(passthrough.includes('-f') || passthrough.includes('--format'))) {
		args.push('--format', 'onerepo');
	}
	if (cache) {
		args.push('--cache', '--cache-strategy=content');
	}
	if (!isDry && fix) {
		args.push('--fix');
	}
	if (!warnings) {
		args.push('--quiet');
	}

	const runStep = logger.createStep('Lint files');
	const [out, err] = await graph.packageManager.run({
		name: `Lint ${all ? '' : filteredPaths.join(', ').substring(0, 40)}…`,
		cmd: 'eslint',
		args: [...args, ...(all ? ['.'] : filteredPaths), ...passthrough],
		opts: {
			cwd: graph.root.location,
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
