import { glob } from 'glob';
import path from 'node:path';
import { batch, file, run, builders } from 'onerepo';
import type { Builder, Handler, RunSpec } from 'onerepo';

export const command = 'build';

export const description = 'Build public workspaces using esbuild.';

type Args = builders.WithAffected &
	builders.WithWorkspaces & {
		version?: string;
	};

export const builder: Builder<Args> = (yargs) =>
	builders.withAffected(
		builders.withWorkspaces(
			yargs
				.usage('$0 build [options]')
				.version(false)
				.example('$0 build', 'Build all workspaces.')
				.example('$0 build -w graph', 'Build the `graph` workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` workspaces.')
		)
	);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces, logger }) {
	const removals: Array<string> = [];
	const buildProcs: Array<RunSpec> = [];
	const typesProcs: Array<RunSpec> = [];

	const workspaces = await getWorkspaces();
	const existsStep = logger.createStep('Check for tsconfigs');

	const [esbuildBin] = await run({
		name: 'Get esbuild bin',
		cmd: 'yarn',
		args: ['bin', 'esbuild'],
	});

	for (const workspace of workspaces) {
		if (workspace.private) {
			logger.warn(`Not building \`${workspace.name}\` because it is private`);
			continue;
		}

		const esmFiles: Array<string> = [];
		const cjsFiles: Array<string> = [];

		// eslint-disable-next-line no-inner-declarations
		function addFile(...filepaths: Array<string>) {
			filepaths.forEach((filepath) => {
				if (filepath.endsWith('.cjs')) {
					cjsFiles.push(filepath);
				} else {
					esmFiles.push(filepath);
				}
			});
		}

		const main = workspace.resolve(workspace.packageJson.main!);
		addFile(main);

		const commands = await glob(`${path.dirname(main)}/**/!(*.test).ts`, { nodir: true });
		if (commands.length) {
			addFile(...commands);
		}

		const { bin } = workspace.packageJson;
		if (bin) {
			if (typeof bin === 'string') {
				addFile(workspace.resolve(bin));
			} else {
				Object.values(bin).forEach((b) => addFile(workspace.resolve(b)));
			}
		}

		removals.push(workspace.resolve('dist'));

		esmFiles.length &&
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...esmFiles,
					'--bundle',
					'--packages=external',
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					'--format=esm',
				],
			});

		cjsFiles.length &&
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...cjsFiles,
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					'--format=cjs',
					'--out-extension:.js=.cjs',
				],
			});

		const isTS = await file.exists(workspace.resolve('tsconfig.json'), { step: existsStep });
		if (isTS) {
			typesProcs.push({
				name: `Build ${workspace.name} typedefs`,
				cmd: 'npx',
				args: ['tsc', '--emitDeclarationOnly', '--outDir', workspace.resolve('dist')],
				opts: {
					cwd: workspace.location,
				},
			});
		}
	}
	await existsStep.end();

	const removeStep = logger.createStep('Clean previous build directories');
	await Promise.all(removals.map((dir) => file.remove(dir, { step: removeStep })));
	await removeStep.end();

	await batch([...buildProcs, ...typesProcs]);
};
