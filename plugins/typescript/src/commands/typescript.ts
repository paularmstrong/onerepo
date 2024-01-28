import { constants, existsSync } from 'node:fs';
import * as builders from '@onerepo/builders';
import * as file from '@onerepo/file';
import type { RunSpec } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Workspace } from '@onerepo/graph';

export const command = ['tsc', 'typescript', 'typecheck'];

export const description = 'Sync TS project references';

type Argv = { pretty: boolean; 'use-project-references': boolean; tsconfig: string } & builders.WithWorkspaces &
	builders.WithAffected;

export const builder: Builder<Argv> = (yargs) =>
	builders
		.withAffected(builders.withWorkspaces(yargs))
		.option('pretty', {
			type: 'boolean',
			default: true,
			description: 'Control TypeScript’s `--pretty` flag.',
		})
		.option('tsconfig', {
			type: 'string',
			default: 'tsconfig.json',
			description: 'The filename of the tsconfig to find in each Workspace.',
			hidden: true,
		})
		.option('use-project-references', {
			alias: ['project-references', 'project-refs'],
			type: 'boolean',
			default: false,
			hidden: true,
			description: 'Automatically sync and use typescript project references',
		})
		.epilogue('Checks for the existence of `tsconfig.json` file and batches running `tsc --noEmit` in each Workspace.');

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { pretty, 'use-project-references': useProjectRefs, tsconfig, verbosity } = argv;
	const workspaces = await getWorkspaces();

	if (useProjectRefs) {
		const configs: Array<string> = [];

		const sync = logger.createStep('Sync projects');
		const withTsConfig: Array<Workspace> = [];
		for (const ws of graph.workspaces) {
			if (existsSync(ws.resolve(tsconfig))) {
				withTsConfig.push(ws);
			}
		}

		for (const ws of graph.dependents()) {
			const wsTsconfigPath = ws.resolve(tsconfig);
			if (withTsConfig.includes(ws)) {
				const deps = (ws.isRoot ? graph.workspaces : graph.dependencies(ws)).filter(
					(workspace) => ws !== workspace && withTsConfig.includes(workspace),
				);
				const contents = await file.read(wsTsconfigPath, constants.O_RDWR, { step: sync });
				const config = JSON.parse(contents);
				const newProjects = new Set(deps.map((dep) => ws.relative(dep.location)));
				const oldProjects = new Set((config.references ?? []).map(({ path }: { path: string }) => path));
				const union = new Set([...newProjects, ...oldProjects]);
				if (union.size !== newProjects.size || union.size !== oldProjects.size) {
					config.references = Array.from(newProjects).map((path) => ({ path }));
					await file.write(wsTsconfigPath, JSON.stringify(config, null, 2), { step: sync });
				}
				if (workspaces.includes(ws)) {
					configs.push(wsTsconfigPath);
				}
			}
		}
		await sync.end();

		await graph.packageManager.run({
			name: 'Typecheck',
			cmd: 'tsc',
			args: [
				'--build',
				...configs,
				pretty ? '--pretty' : '--no-pretty',
				'--emitDeclarationOnly',
				...(verbosity > 3 ? ['--verbose'] : []),
			],
		});

		return;
	}

	const procs = workspaces.reduce((memo: Array<RunSpec>, workspace: Workspace) => {
		if (existsSync(workspace.resolve(tsconfig))) {
			memo.push({
				name: `Typecheck ${workspace.name}`,
				cmd: 'tsc',
				args: ['-p', workspace.resolve(tsconfig), '--noEmit', pretty ? '--pretty' : '--no-pretty'],
			});
		}
		return memo;
	}, [] as Array<RunSpec>);

	await graph.packageManager.batch(procs);
};
