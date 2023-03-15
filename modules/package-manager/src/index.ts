import type { IPackageManager } from './methods';
import type { PackageManager } from './get-package-manager';
import { Npm } from './npm';
import { Pnpm } from './pnpm';
import { Yarn } from './yarn';

export * from './get-package-manager';

export function getManager(type: PackageManager) {
	return managers[type];
}

const managers: Record<PackageManager, IPackageManager> = {
	npm: Npm,
	pnpm: Pnpm,
	yarn: Yarn,
};
