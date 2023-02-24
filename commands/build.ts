import glob from 'glob';
import path from 'node:path';
import { batch, file, logger, run, withAffected, withWorkspaces } from 'onerepo';
import type { Builder, Handler, RunSpec, WithAffected, WithWorkspaces } from 'onerepo';

export const command = 'build';

export const description = 'Build public workspaces using esbuild.';

type Args = WithAffected &
	WithWorkspaces & {
		version?: string;
	};

export const builder: Builder<Args> = (yargs) =>
	withAffected(
		withWorkspaces(
			yargs
				.usage('$0 build [options]')
				.version(false)
				.example('$0 build', 'Build all workspaces.')
				.example('$0 build -w graph', 'Build the `graph` workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` workspaces.')
		)
	);

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces }) {
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

		const files: Array<string> = [];
		const main = workspace.resolve(workspace.packageJson.main!);
		files.push(main);

		const commands = glob.sync(`${path.join(path.dirname(main), 'commands')}/!(*.test).ts`, { nodir: true });
		if (commands.length) {
			files.push(...commands);
		}

		const { bin } = workspace.packageJson;
		if (bin) {
			if (typeof bin === 'string') {
				files.push(workspace.resolve(bin));
			} else {
				Object.values(bin).forEach((b) => files.push(workspace.resolve(b)));
			}
		}

		removals.push(workspace.resolve('dist'));

		files.length &&
			buildProcs.push({
				name: `Build ${workspace.name}`,
				cmd: esbuildBin,
				args: [
					...files,
					`--outdir=${workspace.resolve('dist')}`,
					'--platform=node',
					'--format=esm',
					'--bundle',
					'--packages=external',
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
