import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { getLockfile, getPackageManagerName } from '@onerepo/package-manager';
import { Graph } from './Graph';
import type { PackageJson, PrivatePackageJson } from './Workspace';

export * from './Graph';
export * from './Workspace';

const PackageCache = new Map<string, PackageJson>();

const require = createRequire('/');

/**
 * @internal
 */
export function getGraph(workingDir: string = process.cwd()) {
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

	return new Graph(workingDir, json as PrivatePackageJson, workspaces, require);
}

/**
 * @internal
 */
export function getRootPackageJson(searchLocation: string): { filePath: string; json: PrivatePackageJson } {
	let currLocation = searchLocation;
	while (currLocation !== '/') {
		const match = getPackageJson<PrivatePackageJson>(currLocation);
		if (getLockfile(path.dirname(match.filePath))) {
			return match;
		}
		currLocation = path.dirname(path.dirname(match.filePath));
	}
	throw new Error('No monorepo found. Unable to find lock file.');
}

function getPackageJson<T extends PackageJson = PackageJson>(root: string): { filePath: string; json: T } {
	const filePath = findFileUp(root, 'package.json');
	if (PackageCache.has(filePath)) {
		return { filePath, json: PackageCache.get(filePath) as T };
	}

	const json = require(filePath);
	PackageCache.set(filePath, json);

	return { filePath, json };
}

function findFileUp(startDir: string, fileName: string): string {
	if (startDir === '/') {
		throw new Error('No package.json file found upwards from current directory');
	}
	const filePath = path.join(startDir, fileName);
	if (existsSync(filePath)) {
		return filePath;
	}
	return findFileUp(path.dirname(startDir), fileName);
}
