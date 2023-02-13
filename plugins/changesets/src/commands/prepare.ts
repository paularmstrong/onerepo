import inquirer from 'inquirer';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import type { Package, Packages } from '@manypkg/get-packages';
import { read as readConfig } from '@changesets/config';
import type { Builder, Handler } from '@onerepo/types';

export const command = 'prepare';

export const description =
	'Prepare workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.';

export const builder: Builder = (yargs) => yargs;

export const handler: Handler = async (argv, { graph, logger }) => {
	const { 'dry-run': isDryRun } = argv;

	const packageList: Array<Package> = Object.values(graph.workspaces).map(
		(ws) => ({ packageJson: ws.packageJson, dir: ws.location } as Package)
	);
	const packages: Packages = {
		tool: 'root',
		packages: packageList,
		root: { packageJson: graph.root.packageJson, dir: graph.root.location } as Package,
	};

	const config = await readConfig(graph.root.location, packages);
	const changesets = await readChangesets(graph.root.location);

	const names = new Set<string>();
	changesets.forEach(({ releases }) => {
		releases.forEach(({ name }) => names.add(name));
	});

	const { choices } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'choices',
			message: 'Which workspaces would you like to release?',
			choices: Array.from(names),
		},
	]);

	const affectedChoices = graph.affected(choices);

	const filteredChangesets = changesets.filter(({ releases }) => {
		return releases.some(({ name }) => affectedChoices.includes(name));
	});

	if (!filteredChangesets.length) {
		logger.error(`There are no changesets available for ${choices.join(', ')}`);
		return;
	}

	logger.debug(`found changesets:\n${JSON.stringify(filteredChangesets)}`);

	const releasePlan = assembleReleasePlan([], packages, config, undefined);

	logger.debug(`Made release plan: ${JSON.stringify(releasePlan)}`);

	if (!isDryRun) {
		await applyReleasePlan(releasePlan, packages, config);
	}
};
