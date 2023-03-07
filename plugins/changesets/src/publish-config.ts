import { write } from '@onerepo/file';
import { stepWrapper } from '@onerepo/logger';
import type { LogStep } from '@onerepo/logger';
import type { PublicPackageJson, Workspace } from '@onerepo/graph';

type Options = {
	step?: LogStep;
	write?: boolean;
};

const availableKeys = ['bin', 'main', 'module', 'typings', 'exports'];

export function applyPublishConfig(packageJson: PublicPackageJson): PublicPackageJson {
	const { devDependencies, publishConfig = {}, ...rest } = packageJson;

	const newPackageJson: PublicPackageJson = rest;

	for (const key of availableKeys) {
		if (key in publishConfig) {
			// @ts-ignore it's okay, probably
			newPackageJson[key] = publishConfig[key];
		}
	}

	if ('registry' in publishConfig) {
		newPackageJson.publishConfig = { registry: publishConfig.registry };
	}

	return newPackageJson;
}

export function resetPackageJson(workspace: Workspace, { step }: Options = {}) {
	return stepWrapper({ step, name: `Reset ${workspace.name} package.json` }, async (step) => {
		await write(workspace.resolve('package.json'), JSON.stringify(workspace.packageJson, null, 2), { step });
	});
}
