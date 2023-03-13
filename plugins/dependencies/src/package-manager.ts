import { exists } from '@onerepo/file';
import type { Graph } from '@onerepo/graph';

export async function getPackageManager(graph: Graph) {
	if ('packageManager' in graph.root.packageJson && typeof graph.root.packageJson.packageManager === 'string') {
		return graph.root.packageJson.packageManager.split('@')[0];
	}

	const yarnLock = await exists(graph.root.resolve('yarn.lock'));
	const yarnrc = await exists(graph.root.resolve('.yarnrc.yml'));
	if (yarnLock || yarnrc) {
		return 'yarn';
	}

	const npmLock = await exists(graph.root.resolve('package-lock.json'));
	if (npmLock) {
		return 'npm';
	}

	throw new Error('Could not determin package manager. Please configure @onerepo/plugins-dependencies directly.');
}
