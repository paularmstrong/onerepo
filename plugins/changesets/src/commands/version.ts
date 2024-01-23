import initJiti from 'jiti';
import inquirer from 'inquirer';
import pc from 'picocolors';
import { read as readConfig } from '@changesets/config';
import { isClean, updateIndex } from '@onerepo/git';
import type { Package, Packages } from '@manypkg/get-packages';
import type { Builder, Handler } from '@onerepo/yargs';
import type { LogStep } from '@onerepo/logger';
import { DependencyType } from '@onerepo/graph';
import assembleReleasePlan from '@changesets/assemble-release-plan';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import type { NewChangeset } from '@changesets/types';

export const command = 'version';

export const description =
	'Version workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.';

type Argv = {
	add: boolean;
	'allow-dirty': boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.usage('$0 version')
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			hidden: true,
			description: 'Bypass checks to ensure no local changes before publishing.',
		})
		.option('add', {
			description:
				'Add the modified files like `package.json` and `CHANGELOG.md` files to the git stage for committing.',
			type: 'boolean',
			default: true,
		});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { add, 'allow-dirty': allowDirty, 'dry-run': isDryRun } = argv;
	// !important! changesets _still_ does not build and/or export ESM correctly, so jiti is necessary to fix the issue
	initJiti(__filename).register();

	if (!allowDirty) {
		const cleanStep = logger.createStep('Ensure clean working directory');
		if (!(await isClean({ step: cleanStep }))) {
			cleanStep.error(
				'Working directory must be unmodified to ensure correct versioning. Advanced: Use `--allow-dirty` to bypass this check.',
			);
			await cleanStep.end();
			return;
		}
		await cleanStep.end();
	}

	const requestStep = logger.createStep('Get changesets');

	const packageList: Array<Package> = Object.values(graph.workspaces).map(
		(ws) => ({ packageJson: ws.packageJson, dir: ws.location }) as Package,
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

	logger.pause();
	const { choices } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'choices',
			message: `Which workspaces would you like to release?
  ${pc.dim('Something missing? Add a changeset to describe the version update before proceeding.')}

`,
			choices: available,
			pageSize: available.length,
			validate: (input) => {
				if (!input.length) {
					return `${pc.bold(pc.red('Error:'))} Please select at least one workspace.`;
				}
				return true;
			},
		},
	]);
	logger.unpause();

	if (choices.length === 0) {
		requestStep.warn('No workspaces were selected. Nothing to do.');
		return;
	}

	const choiceDependencies = graph
		.dependencies(choices, true, DependencyType.PROD)
		.filter((ws) => !ws.private)
		.map(({ name }) => name);

	if (choiceDependencies.length !== choices.length) {
		requestStep.warn(
			`The following dependencies will also be versioned:\n${choiceDependencies
				.filter((name) => !choices.includes(name))
				.sort()
				.map((name) => ` - ${name}`)
				.join('\n')}`,
		);
	}

	await requestStep.end();

	const filterStep = logger.createStep('Filter changesets');
	const { filteredChangesets, affectedChoices } = filterChangesets(changesets, choiceDependencies, filterStep);

	if (!filteredChangesets.length) {
		logger.error(`There are no changesets available for ${choices.join(', ')}`);
		return;
	}

	filterStep.debug(`Found changesets:\n${JSON.stringify(filteredChangesets)}`);

	if (affectedChoices.length !== choiceDependencies.length) {
		logger.pause();
		const { okay } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'okay',
				message: `Due to changesets related to multiple workspaces not chosen, the following ${pc.red(
					'also',
				)} need to be published!\n${pc.dim(
					affectedChoices
						.filter((name) => !choiceDependencies.includes(name))
						.sort()
						.map((name) => name)
						.join(', '),
				)}\nIs it okay to proceed?`,
			},
		]);
		logger.unpause();

		if (!okay) {
			await filterStep.end();
			process.exitCode = 1;
			return;
		}
	}
	await filterStep.end();

	const releasePlan = assembleReleasePlan(filteredChangesets, packages, config, undefined);

	logger.debug(`Made release plan: ${JSON.stringify(releasePlan)}`);

	if (!isDryRun) {
		await applyReleasePlan(releasePlan, packages, config);
	}

	const lockfile = await graph.packageManager.install();

	if (add && !isDryRun) {
		// @ts-ignore does not understand filter(Boolean)
		const files: Array<string> = graph.workspaces
			.map((ws) => [ws.resolve('package.json'), !ws.private ? ws.resolve('CHANGELOG.md') : false])
			.flat()
			.filter(Boolean);
		await updateIndex([graph.root.resolve('.changeset'), lockfile, ...files]);
	}
};

function filterChangesets(
	changesets: Array<NewChangeset>,
	affectedChoices: Array<string>,
	step: LogStep,
): { filteredChangesets: Array<NewChangeset>; affectedChoices: Array<string> } {
	const filteredChangesets = changesets.filter(({ releases }) => {
		return releases.some(({ name }) => affectedChoices.includes(name));
	});

	const needed = new Set<string>();
	for (const { releases, id } of filteredChangesets) {
		releases.forEach(({ name }) => {
			if (!affectedChoices.includes(name)) {
				step.debug(`"${name}" was found in changeset "${id}" but is not included for publish. Adding it now.`);
				needed.add(name);
			}
		});
	}
	if (needed.size > 0) {
		return filterChangesets(changesets, [...affectedChoices, ...Array.from(needed)], step);
	}

	return { filteredChangesets, affectedChoices };
}
