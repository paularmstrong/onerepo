import inquirer from 'inquirer';
import pc from 'picocolors';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import type { Package, Packages } from '@manypkg/get-packages';
import { read as readConfig } from '@changesets/config';
import type { Builder, Handler } from '@onerepo/types';
import { updateIndex } from '@onerepo/git';

export const command = 'version';

export const description =
	'Version workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.';

type Argv = {
	add: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage('$0 version').option('add', {
		alias: ['update-index'],
		description: 'Add the modified `package.json` files to the git stage for committing.',
		type: 'boolean',
		default: true,
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { add, 'dry-run': isDryRun } = argv;

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

	const available = Array.from(names).sort();

	const { choices } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'choices',
			message: `Which workspaces would you like to release?
  ${pc.dim('Something missing? Add a changeset to describe the version update before proceeding.')}

`,
			choices: available,
			pageSize: available.length,
		},
	]);

	if (choices.length === 0) {
		logger.warn('No workspaces were selected. Nothing to do.');
		return;
	}

	const affectedChoices = graph.dependencies(choices, true).map(({ name }) => name);

	const filteredChangesets = changesets.filter(({ releases }) => {
		return releases.some(({ name }) => affectedChoices.includes(name));
	});

	if (!filteredChangesets.length) {
		logger.error(`There are no changesets available for ${choices.join(', ')}`);
		return;
	}

	logger.debug(`Found changesets:\n${JSON.stringify(filteredChangesets)}`);

	const releasePlan = assembleReleasePlan(filteredChangesets, packages, config, undefined);

	logger.debug(`Made release plan: ${JSON.stringify(releasePlan)}`);

	if (!isDryRun) {
		await applyReleasePlan(releasePlan, packages, config);
	}

	if (add && !isDryRun) {
		await updateIndex(graph.workspaces.map((ws) => [ws.resolve('package.json'), ws.resolve('CHANGELOG.md')]).flat());
	}
};
