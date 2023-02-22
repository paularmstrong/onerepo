import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { PackageJson, PrivatePackageJson } from './Workspace';
import { Graph } from './Graph';

export type { Graph as Repository, SerializedGraph } from './Graph';
export * from './Workspace';

const PackageCache = new Map<string, PackageJson>();

const require = createRequire('/');

export function getGraph(workingDir: string = process.cwd()) {
	const { filePath, json } = getRootPackageJson(workingDir);
	return new Graph(path.dirname(filePath), json as PrivatePackageJson, require);
}

export function getRootPackageJson(searchLocation: string): { filePath: string; json: PrivatePackageJson } {
	let currLocation = searchLocation;
	while (currLocation !== '/') {
		const match = getPackageJson<PrivatePackageJson>(currLocation);
		if ('workspaces' in match.json) {
			return match;
		}
		currLocation = path.dirname(currLocation);
	}
	throw new Error('No monorepo found. Missing "workspaces" declaration in any package.json');
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
