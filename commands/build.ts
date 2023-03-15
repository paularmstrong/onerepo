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
	const postCopy: Array<() => Promise<void>> = [];

	const workspaces = await getWorkspaces();

	const [esbuildBin] = await run({
		name: 'Get esbuild bin',
		cmd: 'yarn',
		args: ['bin', 'esbuild'],
	});
	const [tsc] = await run({
		name: 'Get TypeScript compiler',
		cmd: 'yarn',
		args: ['bin', 'tsc'],
	});

	const buildableStep = logger.createStep('Checking for buildable workspaces');

	for (const workspace of workspaces) {
		if (workspace.private) {
			logger.warn(`Not building \`${workspace.name}\` because it is private`);
			continue;
		}

		const esmFiles = new Set<string>();
		const cjsFiles = new Set<string>();

		// eslint-disable-next-line no-inner-declarations
		function addFile(...filepaths: Array<string>) {
			filepaths.forEach((filepath) => {
				if (filepath.endsWith('.cjs')) {
					cjsFiles.add(filepath);
				} else {
					esmFiles.add(filepath);
				}
			});
		}

		const main = workspace.resolve(workspace.packageJson.main!);
		addFile(main);

		if (await file.exists(workspace.resolve('src/fixtures'))) {
			postCopy.push(() => file.copy(workspace.resolve('src/fixtures'), workspace.resolve('dist/fixtures')));
		}

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

		esmFiles.size &&
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...Array.from(esmFiles),
					'--bundle',
					'--packages=external',
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					'--format=esm',
				],
			});

		cjsFiles.size &&
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...Array.from(cjsFiles),
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					'--format=cjs',
					'--out-extension:.js=.cjs',
				],
			});

		const isTS = await file.exists(workspace.resolve('tsconfig.json'), { step: buildableStep });
		if (isTS) {
			typesProcs.push({
				name: `Build ${workspace.name} typedefs`,
				cmd: tsc,
				args: ['--emitDeclarationOnly', '--outDir', workspace.resolve('dist')],
				opts: {
					cwd: workspace.location,
				},
			});
		}
	}

	await buildableStep.end();

	const removeStep = logger.createStep('Clean previous build directories');
	await Promise.all(removals.map((dir) => file.remove(dir, { step: removeStep })));
	await removeStep.end();

	await batch([...buildProcs, ...typesProcs]);
	await Promise.all(postCopy.map((fn) => fn()));
};
