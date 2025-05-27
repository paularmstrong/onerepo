import path from 'node:path';
import { glob } from 'glob';
import ignore from 'ignore';
import { git, file, builders } from 'onerepo';
import type { Builder, Handler, Logger, Workspace } from 'onerepo';
import type { ConfigArray, default as tseslint } from 'typescript-eslint';

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

	const setup = logger.createStep('Syncing projects');
	const root = await getEslintConfig(graph.root, logger);
	if (!root) {
		throw new Error('No root eslint configuration found.');
	}

	const configs = (await Promise.all(graph.workspaces.map((ws) => !ws.isRoot && getEslintConfig(ws, logger)))).filter(
		(res) => !!res,
	);

	await setup.end();

	let filteredPaths: Array<string> = [];
	if (!all) {
		const ignoreStep = logger.createStep('Filtering ignored files');

		const paths = await getFilepaths({ step: ignoreStep });
		filteredPaths = paths.includes('.') ? ['.'] : paths;

		await ignoreStep.end();
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

async function getEslintConfig(ws: Workspace, logger: Logger): Promise<[Workspace, ConfigArray] | null> {
	const config = await glob('eslint.config.{js,mjs,cjs,ts,mts,cts}', { cwd: ws.location });
	if (config.length > 1) {
		throw new Error(`Too many eslint configuration files found in "${ws.name}". Please reduce to one.`);
	}

	if (!config[0]) {
		return null;
	}

	const res = (await import(path.join(ws.location, config[0]))) as ConfigArray;
	return [ws, res];
}
