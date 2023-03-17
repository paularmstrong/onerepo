import type { PackageManager } from './methods';
import type { PackageManagerName } from './get-package-manager';
import { Npm } from './npm';
import { Pnpm } from './pnpm';
import { Yarn } from './yarn';

export * from './get-package-manager';

export function getManager(type: PackageManagerName): PackageManager {
	return managers[type];
}

const managers: Record<PackageManagerName, PackageManager> = {
	npm: Npm,
	pnpm: Pnpm,
	yarn: Yarn,
};

export type { PackageManager };
