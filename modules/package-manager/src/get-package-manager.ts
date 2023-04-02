import path from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Get the package manager for the current working directory with _some_ confidence
 *
 * @param cwd Current working directory. Should be the root of the module/repository.
 * @param fromPkgJson Value as defined in a package.json file, typically the `packageManager` value
 *
 * @group Package Management
 */
export function getPackageManagerName(cwd: string, fromPkgJson?: string): 'npm' | 'pnpm' | 'yarn' {
	if (fromPkgJson) {
		const [value] = fromPkgJson.split('@');
		if (value === 'npm' || value === 'pnpm' || value === 'yarn') {
			return value;
		}
	}

	return guessPackageManager(cwd) ?? 'npm';
}

function guessPackageManager(cwd: string): 'npm' | 'pnpm' | 'yarn' | null {
	const lockfile = getLockfile(cwd);
	if (lockfile?.endsWith('package-lock.json')) {
		return 'npm';
	}
	if (lockfile?.endsWith('yarn.lock')) {
		return 'yarn';
	}
	if (lockfile?.endsWith('pnpm-lock.yaml')) {
		return 'pnpm';
	}

	if (existsSync(path.resolve(cwd, '.yarnrc.yml')) || existsSync(path.resolve(cwd, '.yarnrc.yaml'))) {
		return 'yarn';
	}

	if (
		// From PNPm: 'The workspace manifest file should be named "pnpm-workspace.yaml"'
		// pnpm-workspace.yml will throw an error from PNPm and not work.
		existsSync(path.resolve(cwd, 'pnpm-workspace.yaml'))
	) {
		return 'pnpm';
	}

	return null;
}

export function getLockfile(cwd: string) {
	if (existsSync(path.resolve(cwd, 'package-lock.json'))) {
		return path.resolve(cwd, 'package-lock.json');
	}

	if (existsSync(path.resolve(cwd, 'yarn.lock'))) {
		return path.resolve(cwd, 'yarn.lock');
	}

	if (existsSync(path.resolve(cwd, 'pnpm-lock.yaml'))) {
		return path.resolve(cwd, 'pnpm-lock.yaml');
	}

	return null;
}
