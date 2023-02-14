import { write } from '@onerepo/file';
import { stepWrapper } from '@onerepo/logger';
import type { Step } from '@onerepo/logger';
import type { PublicPackageJson, Workspace } from '@onerepo/graph';

type Options = {
	step?: Step;
	write?: boolean;
};

const availableKeys = ['bin', 'main', 'module', 'typings', 'exports'];

export function applyPublishConfig(packageJson: PublicPackageJson): PublicPackageJson {
	const { devDependencies, publishConfig = {}, ...newPackageJson } = packageJson;

	for (const key of availableKeys) {
		if (key in publishConfig) {
			// @ts-ignore it's okay, probably
			newPackageJson[key] = publishConfig[key];
		}
	}

	return newPackageJson;
}

export function resetPackageJson(workspace: Workspace, { step }: Options = {}) {
	return stepWrapper({ step, name: `Reset ${workspace.name} package.json` }, async (step) => {
		await write(workspace.resolve('package.json'), JSON.stringify(workspace.packageJson, null, 2), { step });
	});
}
