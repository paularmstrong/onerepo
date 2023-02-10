import glob from 'glob';
import { batch, file, logger, withAffected, withWorkspaces } from '@onerepo/cli';
import type { Builder, Handler, RunSpec, WithAffected, WithWorkspaces } from '@onerepo/cli';

export const command = 'build';

export const description = 'Build public workspaces using esbuild.';

type Args = WithAffected & WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	withAffected(
		withWorkspaces(
			yargs
				.usage('$0 build [options]')
				.example('$0 build', 'Build all workspaces.')
				.example('$0 build -w graph', 'Build the `graph` workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` workspaces.')
		)
	);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
	const existsStep = logger.createStep('Check for TSconfigs');
	const removals: Array<string> = [];
	const buildProcs: Array<RunSpec> = [];
	const typesProcs: Array<RunSpec> = [];

	const workspaces = await getWorkspaces();

	for (const workspace of workspaces) {
		if (workspace.private) {
			logger.warn(`Not building \`${workspace.name}\` because it is private`);
			continue;
		}

		const files = glob.sync(`${workspace.resolve('src')}/**/!(*.test).ts`);

		removals.push(workspace.resolve('dist'));

		buildProcs.push({
			name: `Build ${workspace.name}`,
			cmd: 'npx',
			args: ['esbuild', ...files, `--outdir=${workspace.resolve('dist')}`, '--platform=node'],
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

	await batch(buildProcs);
	await batch(typesProcs);

	const copyStep = logger.createStep('Copy package.json files');
	for (const workspace of workspaces) {
		if (workspace.private) {
			continue;
		}

		const { devDependencies, ...newPackageJson } = { ...workspace.packageJson };
		newPackageJson.main = './index.js';
		// @ts-ignore
		newPackageJson.typings = './src/index.d.ts';

		await file.write(workspace.resolve('dist', 'package.json'), JSON.stringify(newPackageJson, null, 2), {
			step: copyStep,
		});
	}
	await copyStep.end();
};
