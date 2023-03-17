import path from 'node:path';
import { existsSync } from 'node:fs';

export type PackageManagerName = 'npm' | 'pnpm' | 'yarn';

/**
 * Get the package manager for the current working directory with _some_ confidence
 *
 * @param cwd Current working directory. Should be the root of the module/repository.
 * @param fromPkgJson Value as defined in a package.json file, typically the `packageManager` value
 */
export function getPackageManager(cwd: string, fromPkgJson?: string): PackageManagerName {
	if (fromPkgJson) {
		const [value] = fromPkgJson.split('@');
		if (value === 'npm' || value === 'pnpm' || value === 'yarn') {
			return value;
		}
	}

	return getLockfile(cwd) ?? 'npm';
}

function getLockfile(cwd: string): PackageManagerName | null {
	if (existsSync(path.resolve(cwd, 'package-lock.json'))) {
		return 'npm';
	}

	if (
		existsSync(path.resolve(cwd, 'yarn.lock')) ||
		existsSync(path.resolve(cwd, '.yarnrc.yml')) ||
		existsSync(path.resolve(cwd, '.yarnrc.yaml'))
	) {
		return 'yarn';
	}

	if (
		existsSync(path.resolve(cwd, 'pnpm-lock.json')) ||
		existsSync(path.resolve(cwd, 'pnpm-workspace.yml')) ||
		existsSync(path.resolve(cwd, 'pnpm-workspace.yaml'))
	) {
		return 'pnpm';
	}

	return null;
}
