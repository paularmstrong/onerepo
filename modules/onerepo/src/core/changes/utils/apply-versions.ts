import type { Graph, Workspace } from '@onerepo/graph';
import { write } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import type { PackageJson } from '@onerepo/package-manager';
import type { VersionPlan } from './get-versionable';

export async function applyVersions(
	toVersion: Array<Workspace>,
	graph: Graph,
	plan: Map<Workspace, VersionPlan>,
	options: { step?: LogStep } = {},
) {
	return stepWrapper({ name: 'Apply new versions', step: options.step }, async (step) => {
		const updates: Record<string, PackageJson> = {};

		for (const ws of toVersion) {
			if (!(ws.name in updates)) {
				updates[ws.name] = ws.packageJson;
			}
			const newVersion = plan.get(ws)!.version;
			updates[ws.name].version = newVersion;

			for (const dep of graph.dependents(ws)) {
				if (ws.name in dep.dependencies && !dep.dependencies[ws.name].startsWith('workspace')) {
					if (!(dep.name in updates)) {
						updates[dep.name] = dep.packageJson;
					}
					updates[dep.name].dependencies![ws.name] = newVersion;
				}
				if (ws.name in dep.devDependencies && !dep.devDependencies[ws.name].startsWith('workspace')) {
					if (!(dep.name in updates)) {
						updates[dep.name] = dep.packageJson;
					}
					updates[dep.name].devDependencies![ws.name] = newVersion;
				}
			}
		}

		for (const [name, packageJson] of Object.entries(updates)) {
			await write(graph.getByName(name).resolve('package.json'), JSON.stringify(packageJson, null, 2), { step });
		}
	});
}
