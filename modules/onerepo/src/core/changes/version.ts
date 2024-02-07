import cliui from 'cliui';
import pc from 'picocolors';
import inquirer from 'inquirer';
import type { Builder, Handler } from '@onerepo/yargs';
import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Workspace } from '@onerepo/graph';
import type { Logger } from '@onerepo/logger';
import type { VersionPlan } from './utils/get-versionable';
import { applyVersions, getVersionable, confirmClean, requestVersioned, consumeChangelogs } from './utils';

export const command = ['version'];

export const description = 'Update version numbers for publishable workspaces';

type Argv = WithWorkspaces & {
	'allow-dirty': boolean;
	prerelease?: string;
};

export const builder: Builder<Argv> = (yargs) =>
	withWorkspaces(yargs)
		.usage(`$0 ${command[0]}`)
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			description: 'Bypass checks to ensure no there are no un-committed changes.',
		})
		.option('prerelease', {
			type: 'string',
			alias: ['pre', 'pre-release'],
			description: 'Create a pre-release using the specified identifier.',
		})
		.example(
			`$0 ${command[0]} --prerelease=alpha`,
			'Create a prerelease for the next version the form of `1.2.3-alpha.0`.',
		);

export const handler: Handler<Argv> = async (argv, { config, getWorkspaces, graph, logger }) => {
	const { 'allow-dirty': allowDirty, prerelease } = argv;

	const setup = logger.createStep('Gathering information');

	if (!allowDirty) {
		if (!(await confirmClean({ step: setup }))) {
			return;
		}
	}

	let requested = await getWorkspaces({ step: setup });
	await setup.end();

	const versionPlans = await getVersionable(graph, { prerelease: !!prerelease, identifier: prerelease });

	if (!requested.length) {
		requested = await requestVersioned(graph, versionPlans);
	}

	if (!requested.length) {
		logger.error('No workspaces selected. Cancelling.');
		return;
	}

	const deps = graph.dependencies(requested, true);
	// TODO: should this include dependents?
	const toVersion: Array<Workspace> = Array.from(versionPlans.keys()).filter((ws) => deps.includes(ws));

	if (!(await requestedOkay(versionPlans, requested, toVersion, logger))) {
		logger.error('Cancelled. No changes have been made.');
		return;
	}

	await applyVersions(toVersion, graph, versionPlans);
	await consumeChangelogs(toVersion, graph, versionPlans, config.changes.formatting ?? {});
	await graph.packageManager.install();
};

/**
 * Display a table of what will be versioned and how.
 * Request input on whether it is okay to proceed or not.
 */
export async function requestedOkay(
	allVersionable: Map<Workspace, VersionPlan>,
	requested: Array<Workspace>,
	toVersion: Array<Workspace>,
	logger: Logger,
) {
	if (!requested.length) {
		return true;
	}

	const width = Math.min(100, process.stdout.columns);
	const wsWidth = Math.max(...Array.from(allVersionable.keys()).map((ws) => ws.name.length + 2));
	const versionWidth = Math.max(9, ...Array.from(allVersionable.keys()).map((ws) => ws.version!.length + 2));
	const newVersionWidth = Math.max(...Array.from(allVersionable.values()).map(({ version }) => version.length + 2));
	const ui = cliui({ width });
	const padding = [0, 1, 0, 1];

	function listItem(ws: Workspace) {
		const plan = allVersionable.get(ws)!;
		ui.div(
			{ text: ws.name, padding, width: wsWidth },
			{ text: ws.version!, align: 'right', padding, width: versionWidth },
			{ text: levelColoredString[plan.type], align: 'center', padding, width: 8 },
			{ text: pc.bold(plan.version), padding, width: newVersionWidth },
		);
	}

	ui.div(
		{ text: pc.bold('Workspace'), padding, width: wsWidth },
		{ text: pc.bold('Current'), align: 'right', padding, width: versionWidth },
		{ text: pc.bold('Type'), align: 'center', padding, width: 8 },
		{ text: pc.bold('New'), padding, width: newVersionWidth },
	);
	ui.div(pc.dim('⎯'.repeat(width)));
	const step = logger.createStep('Verify workspaces');

	requested.map(listItem);

	const extras = toVersion.filter((ws) => !requested.includes(ws));
	if (extras.length) {
		ui.div('');
		ui.div(pc.dim('The following dependencies have changes requiring they are also versioned:'));
		ui.div(pc.dim('⎯'.repeat(width)));
		extras.map(listItem);
	}
	step.info(ui.toString());

	await step.end();
	logger.pause();

	const { okay } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'okay',
			message: 'Is it okay to proceed creating versions for all of the above?',
		},
	]);
	logger.unpause();

	return okay;
}

const levelColoredString = {
	major: pc.red('major'),
	minor: pc.yellow('minor'),
	patch: pc.green('patch'),
};
