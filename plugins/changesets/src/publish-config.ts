import { write } from '@onerepo/file';
import { stepWrapper } from '@onerepo/logger';
import type { Step } from '@onerepo/logger';
import type { PublicPackageJson, Workspace } from '@onerepo/graph';

type Options = {
	step?: Step;
};

const availableKeys = ['bin', 'main', 'module', 'typings', 'exports'];

export function applyPublishConfig(workspace: Workspace, { step }: Options = {}) {
	return stepWrapper({ step, name: `Apply publishConfig to ${workspace.name}` }, async (step) => {
		const { devDependencies, publishConfig = {}, ...newPackageJson } = workspace.packageJson as PublicPackageJson;

		for (const key of availableKeys) {
			if (key in publishConfig) {
				// @ts-ignore it's okay, probably
				newPackageJson[key] = publishConfig[key];
			}
		}

		await write(workspace.resolve('package.json'), JSON.stringify(newPackageJson, null, 2), { step });
	});
}

export function resetPackageJson(workspace: Workspace, { step }: Options = {}) {
	return stepWrapper({ step, name: `Reset ${workspace.name} package.json` }, async (step) => {
		await write(workspace.resolve('package.json'), JSON.stringify(workspace.packageJson, null, 2), { step });
	});
}
