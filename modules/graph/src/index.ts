import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { PackageJson } from '@onerepo/package-manager';
import { getLockfile, getPackageManagerName } from '@onerepo/package-manager';
import initJiti from 'jiti';
import { Graph } from './Graph';

export * from './Graph';
export * from './Workspace';

const PackageCache = new Map<string, PackageJson>();

/**
 * Get the {@link Graph | `Graph`} given a particular root working directory. If the working directory is not a monorepo's root, an empty `Graph` will be given in its place.
 *
 * ```ts
 * const graph = getGraph(process.cwd());
 * assert.ok(graph.isRoot);
 * ```
 *
 * @group Graph
 */
export function getGraph(workingDir: string = process.cwd()) {
	const jiti = initJiti(workingDir, { interopDefault: true });
	const { filePath, json } = getRootPackageJson(workingDir);
	const pkgmanager = getPackageManagerName(filePath, json.packageManager);
	let workspaces = json.workspaces ?? [];
	if (pkgmanager === 'pnpm') {
		const yamlfile = path.join(workingDir, 'pnpm-workspace.yaml');
		if (existsSync(yamlfile)) {
			const rawFile = readFileSync(yamlfile, { encoding: 'utf8' });
			const contents = yaml.load(rawFile) as { packages?: Array<string> };
			workspaces = contents.packages ?? [];
		}
	}

	return new Graph(workingDir, json as PackageJson, workspaces, jiti);
}

/**
 * @internal
 */
export function getRootPackageJson(searchLocation: string): { filePath: string; json: PackageJson } {
	const match = getPackageJson<PackageJson>(searchLocation);
	if (getLockfile(path.dirname(match.filePath))) {
		return match;
	}

	throw new Error('No monorepo found. Unable to find lock file.');
}

/**
 * Get the filepath and json contents of a `package.json` given a working directory.
 */
function getPackageJson<T extends PackageJson = PackageJson>(cwd: string): { filePath: string; json: T } {
	const filePath = path.join(cwd, 'package.json');
	if (PackageCache.has(filePath)) {
		return { filePath, json: PackageCache.get(filePath) as T };
	}

	try {
		const raw = readFileSync(filePath, 'utf-8');
		const json = JSON.parse(raw);
		PackageCache.set(filePath, json);

		return { filePath, json };
	} catch {
		return { filePath, json: { name: 'onerepo-temp' } as T };
	}
}
