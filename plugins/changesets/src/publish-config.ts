import { write } from '@onerepo/file';
import { stepWrapper } from '@onerepo/logger';
import type { LogStep } from '@onerepo/logger';
import type { Workspace } from '@onerepo/graph';

type Options = {
	step?: LogStep;
	write?: boolean;
};

export function resetPackageJson(workspace: Workspace, { step }: Options = {}) {
	return stepWrapper({ step, name: `Reset ${workspace.name} package.json` }, async (step) => {
		await write(workspace.resolve('package.json'), JSON.stringify(workspace.packageJson, null, 2), { step });
	});
}
