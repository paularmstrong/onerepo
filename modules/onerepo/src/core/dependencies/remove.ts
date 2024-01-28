import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Builder, Handler } from '@onerepo/yargs';
import type { PromiseFn } from '@onerepo/subprocess';
import { batch } from '@onerepo/subprocess';
import { write } from '@onerepo/file';

export const command = 'remove';

export const description = 'Remove dependencies from Workspaces.';

type Args = WithWorkspaces & { dedupe: boolean; dependencies: Array<string> };

export const builder: Builder<Args> = (yargs) =>
	withWorkspaces(yargs)
		.usage('$0 remove -w [workspaces...] -d [dependencies...] [options...]')
		.option('dedupe', {
			type: 'boolean',
			default: false,
			description: 'Deduplicate dependencies across the repository after install is complete.',
		})
		.option('dependencies', {
			type: 'array',
			alias: ['d'],
			string: true,
			description: 'Dependency names that should be removed.',
			demandOption: true,
		});

export const handler: Handler<Args> = async function handler(argv, { getWorkspaces, graph, logger }) {
	const { dedupe, dependencies } = argv;

	const workspaces = await getWorkspaces();
	const toRemove = new Set(dependencies);

	const writeStep = logger.createStep('Update package.json files');
	const writes: Array<PromiseFn> = [];
	for (const ws of workspaces) {
		const pkgJson = ws.packageJson;

		if (pkgJson.dependencies) {
			pkgJson.dependencies = removeDependencies(pkgJson.dependencies, toRemove);
		}
		if (pkgJson.devDependencies) {
			pkgJson.devDependencies = removeDependencies(pkgJson.devDependencies, toRemove);
		}
		if (pkgJson.peerDependencies) {
			pkgJson.peerDependencies = removeDependencies(pkgJson.peerDependencies, toRemove);
		}
		writes.push(() =>
			write(ws.resolve('package.json'), JSON.stringify(pkgJson, null, 2), { step: writeStep }).then(() => ['', '']),
		);
	}

	await batch(writes);
	await writeStep.end();

	const packageManager = graph.packageManager;

	await packageManager.install();
	if (dedupe) {
		await packageManager.dedupe();
	}
};

function removeDependencies(current: Record<string, string>, toRemove: Set<string>) {
	return Object.entries(current).reduce(
		(memo, [key, value]) => {
			if (!toRemove.has(key)) {
				memo[key] = value;
			}
			return memo;
		},
		{} as Record<string, string>,
	);
}
