import { Npm } from './npm.ts';
import { Pnpm } from './pnpm.ts';
import { Yarn } from './yarn.ts';
import type { PackageManager } from './methods';

export * from './get-package-manager.ts';
export * from './package-json.ts';
export * from './methods.ts';

/**
 * Get the {@link PackageManager | `PackageManager`} for the given package manager type (NPM, PNPm, or Yarn)
 * @group Package management
 */
export function getPackageManager(type: 'npm' | 'pnpm' | 'yarn'): PackageManager {
	return managers[type];
}

const managers: Record<'npm' | 'pnpm' | 'yarn', PackageManager> = {
	npm: Npm,
	pnpm: Pnpm,
	yarn: Yarn,
};
