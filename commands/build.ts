import path from 'node:path';
import { batch, file, run, builders } from 'onerepo';
import type { Builder, Handler, PromiseFn, RunSpec } from 'onerepo';

export const command = 'build';

export const description = 'Build public Workspaces using esbuild.';

type Args = builders.WithAffected &
	builders.WithWorkspaces & {
		version?: string;
	};

export const builder: Builder<Args> = (yargs) =>
	builders.withAffected(
		builders.withWorkspaces(
			yargs
				.usage('$0 build [options...]')
				.example('$0 build', 'Build all Workspaces.')
				.example('$0 build -w graph', 'Build the `graph` Workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` Workspaces.'),
		),
	);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces, logger }) {
	const removals: Array<string> = [];
	const buildProcs: Array<RunSpec | PromiseFn> = [];
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
			buildableStep.warn(`Not building \`${workspace.name}\` because it is private`);
			continue;
		}

		const esmFiles = new Set<string>();
		const cjsFiles = new Set<string>();
		const bins = new Map<string, [string, string]>();

		// eslint-disable-next-line no-inner-declarations
		function addFile(filepath: string) {
			if (filepath.endsWith('.cjs')) {
				cjsFiles.add(filepath);
			} else {
				esmFiles.add(filepath);
			}
		}

		if (workspace.packageJson.main) {
			const main = workspace.resolve(workspace.packageJson.main);
			addFile(main);
		}

		if (await file.exists(workspace.resolve('src/fixtures'), { step: buildableStep })) {
			postCopy.push(() => file.copy(workspace.resolve('src/fixtures'), workspace.resolve('dist/fixtures')));
		}

		const { bin } = workspace.packageJson;
		if (bin) {
			if (typeof bin === 'string') {
				bins.set(workspace.name, [
					path.dirname(path.relative(workspace.resolve('src'), workspace.resolve(bin))),
					workspace.resolve(bin),
				]);
			} else {
				Object.entries(bin).forEach(([name, bin]) =>
					bins.set(name, [
						path.dirname(path.relative(workspace.resolve('src'), workspace.resolve(bin))),
						workspace.resolve(bin),
					]),
				);
			}
		}

		removals.push(workspace.resolve('dist'));

		if (esmFiles.size) {
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...Array.from(esmFiles),
					'--bundle',
					'--packages=external',
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					`--format=${'type' in workspace.packageJson && workspace.packageJson.type === 'module' ? 'esm' : 'cjs'}`,
				],
			});
		}

		if (cjsFiles.size) {
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
		}

		bins.forEach(([dir, src], name) => {
			buildProcs.push({
				name: `Build bin: ${name}`,
				cmd: esbuildBin,
				args: [
					src,
					'--bundle',
					`--outdir=${workspace.resolve('dist', dir)}`,
					'--platform=node',
					'--format=esm',
					"--banner:js=const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
				],
			});
		});

		const isTsBase = await file.exists(workspace.resolve('tsconfig.json'), { step: buildableStep });
		const isTsBuild = await file.exists(workspace.resolve('tsconfig.build.json'), { step: buildableStep });
		if (isTsBase || isTsBuild) {
			typesProcs.push({
				name: `Build ${workspace.name} typedefs`,
				cmd: tsc,
				args: [
					'-p',
					isTsBuild ? 'tsconfig.build.json' : 'tsconfig.json',
					'--emitDeclarationOnly',
					'--outDir',
					workspace.resolve('dist'),
				],
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
