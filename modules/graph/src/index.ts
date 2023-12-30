/**
 * The workspace graph sits at the center of oneRepo. It determines workspaces, their relationships, and how changes affect the repository.
 *
 * @module
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { getLockfile, getPackageManagerName } from '@onerepo/package-manager';
import initJiti from 'jiti';
import { Graph } from './Graph';
import type { PackageJson, PrivatePackageJson } from './Workspace';

export * from './Graph';
export * from './Workspace';

const PackageCache = new Map<string, PackageJson>();

/**
 * @internal
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
			const contents = yaml.load(rawFile) as { workspaces?: Array<string> };
			workspaces = contents.workspaces ?? [];
		}
	}

	return new Graph(workingDir, json as PrivatePackageJson, workspaces, jiti);
}

/**
 * @internal
 */
export function getRootPackageJson(searchLocation: string): { filePath: string; json: PrivatePackageJson } {
	const match = getPackageJson<PrivatePackageJson>(searchLocation);
	if (getLockfile(path.dirname(match.filePath))) {
		return match;
	}

	throw new Error('No monorepo found. Unable to find lock file.');
}

function getPackageJson<T extends PackageJson = PackageJson>(root: string): { filePath: string; json: T } {
	const filePath = path.join(root, 'package.json');
	if (PackageCache.has(filePath)) {
		return { filePath, json: PackageCache.get(filePath) as T };
	}

	const raw = readFileSync(filePath, 'utf-8');
	const json = JSON.parse(raw);
	PackageCache.set(filePath, json);

	return { filePath, json };
}
