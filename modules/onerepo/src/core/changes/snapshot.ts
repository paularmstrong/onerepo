import type { Builder, Handler } from '@onerepo/yargs';
import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Workspace } from '@onerepo/graph';
import { write } from '@onerepo/file';
import { getCurrentSha } from '@onerepo/git';
import { runTasks } from '../tasks/run-tasks';
import { confirmClean } from './utils/confirm-clean';
import { requestVersioned } from './utils/request-versioned';
import { getVersionable } from './utils/get-versionable';
import { requestedOkay } from './version';
import { requestOtp } from './utils/request-otp';
import { applyVersions } from './utils/apply-versions';

export const command = ['snapshot', 'snap'];

export const description = 'Publish a snapshot pre-release.';

type Argv = WithWorkspaces & {
	'allow-dirty': boolean;
	otp?: boolean;
	reset: boolean;
	tag: string;
};

export const builder: Builder<Argv> = (yargs) =>
	withWorkspaces(yargs)
		.usage(`$0 ${command[0]}`)
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			description: 'Bypass checks to ensure no there are no un-committed changes.',
		})
		.option('otp', {
			type: 'boolean',
			description: 'Prompt for one-time password before publishing to the registry',
		})
		.option('tag', {
			type: 'string',
			default: 'prerelease',
			description: 'Distribution tag to apply when publishing the pre-release.',
		})
		.option('reset', {
			type: 'boolean',
			description: 'Reset `package.json` changes before exiting. Use `--no-reset` to disable.',
			default: true,
		})
		.epilogue(
			'Periodically you may want to publish a _snapshot_ release – something that needs testing from the registry, but should not update the current version nor be made widely available. For these cases, use `--snapshot` and versions will be published in the format `0.0.0-{tag}-{hash}`, where `{hash}` is a short version of the current git sha. By appending a prerelease to version `0.0.0`, discoverability is greatly reduced.',
		);

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph, logger }) => {
	const { 'allow-dirty': allowDirty, otp: shouldRequestOtp, reset, tag } = argv;

	const setup = logger.createStep('Gathering information');

	if (!allowDirty) {
		if (!(await confirmClean({ step: setup }))) {
			return;
		}
	}

	let requested = await getWorkspaces({ step: setup });
	const sha = (await getCurrentSha({ step: setup })).substring(0, 8);
	await setup.end();

	const versionable = await getVersionable(graph, { identifier: tag === 'prerelease' ? 'pre' : tag, snapshot: sha });

	if (!requested.length) {
		requested = await requestVersioned(graph, versionable);
	}

	if (!requested.length) {
		logger.error('No workspaces selected. Cancelling.');
		return;
	}

	const deps = graph.dependencies(requested, true);
	// TODO: should this include dependents?
	const toVersion: Array<Workspace> = Array.from(versionable.all.keys()).filter((ws) => deps.includes(ws));

	if (!(await requestedOkay(versionable.all, requested, toVersion, logger))) {
		logger.error('Cancelled. No changes have been made.');
		return;
	}

	await applyVersions(toVersion, graph, versionable.all);

	const configStep = logger.createStep('Apply publishConfig');
	for (const workspace of toVersion) {
		const newPackageJson = workspace.publishablePackageJson;
		await write(workspace.resolve('package.json'), JSON.stringify(newPackageJson, null, 2), { step: configStep });
	}
	await configStep.end();

	await runTasks('pre-publish', ['--workspaces', ...toVersion.map((ws) => ws.name)], graph);

	const otp = shouldRequestOtp ? await requestOtp() : undefined;

	await graph.packageManager.publish({
		workspaces: toVersion,
		otp,
		tag,
	});

	if (reset) {
		const resetStep = logger.createStep('Reset package.json changes');
		for (const ws of toVersion) {
			await write(ws.resolve('package.json'), JSON.stringify(ws.packageJson, null, 2), { step: resetStep });
		}
		await resetStep.end();
	}
};
