import { Npm } from './npm';
import { Pnpm } from './pnpm';
import { Yarn } from './yarn';
import type { PackageManager } from './methods';

export * from './get-package-manager';

/**
 * Get the {@link PackageManager} for the given package manager type (NPM, PNPm, or Yarn)
 * @group Package Management
 */
export function getPackageManager(type: 'npm' | 'pnpm' | 'yarn'): PackageManager {
	return managers[type];
}

const managers: Record<'npm' | 'pnpm' | 'yarn', PackageManager> = {
	npm: Npm,
	pnpm: Pnpm,
	yarn: Yarn,
};

export type { PackageManager };
