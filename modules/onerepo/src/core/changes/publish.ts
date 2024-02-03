import type { WithAffected, WithWorkspaces } from '@onerepo/builders';
import { withAffected, withWorkspaces } from '@onerepo/builders';
import { write } from '@onerepo/file';
import type { Workspace } from '@onerepo/graph';
import type { PublishConfig } from '@onerepo/package-manager';
import type { Builder, Handler } from '@onerepo/yargs';
import { runTasks } from '../tasks/run-tasks';
import { requestOtp } from './utils/request-otp';

export const command = ['publish', 'release'];

export const description = 'Publish all Workspaces with versions not available in the registry.';

type Args = {
	'allow-dirty': boolean;
	otp: boolean;
	'skip-auth': boolean;
} & WithAffected &
	WithWorkspaces;

export const builder: Builder<Args> = (yargs) =>
	withAffected(withWorkspaces(yargs))
		.usage(`$0 ${command[0]} [options]`)
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			hidden: true,
			description: 'Bypass checks to ensure no there are no un-committed changes.',
		})
		.option('otp', {
			type: 'boolean',
			description: 'Set to true if your publishes require an OTP for NPM.',
			default: false,
		})
		.option('skip-auth', {
			type: 'boolean',
			description: 'Skip auth checks. This may be necessary for some internal registries using PATs or tokens.',
			default: false,
		})
		.hide('staged')
		.hide('affected')
		.epilogue(
			`This command is safe to run any time. By default, only Workspaces that have previously gone through the \`one change version\` process will end up being published. Use \`--all\` for all Workspaces or \`--workspaces <workspace-name>\` to specify individual Workspaces to try publishing.

For each Workspace, the registry will be queried first to ensure the current version in the Workspace does not yet exist in the registry. If a version _does_ exist, the Workspace will be skipped.`,
		)
		.example(`$0 ${command[0]} -w api`, 'Publish the `api` Workspace and its dependencies, if necessary.')
		.example(`$0 ${command[0]} --all`, 'Attempt to publish _all_ non-private Workspaces. ');

export const handler: Handler<Args> = async (argv, { getFilepaths, getWorkspaces, graph, logger }) => {
	const { all, otp: shouldRequestOtp, 'skip-auth': skipAuth, workspaces: inputWorkspaces } = argv;

	const setupStep = logger.createStep('Gathering information');

	let workspaces: Array<Workspace> = [];

	if (!all && !inputWorkspaces?.length) {
		const filepaths = await getFilepaths({ step: setupStep, affectedThreshold: 1000 });
		for (const filepath of filepaths) {
			if (filepath.endsWith('/package.json')) {
				workspaces.push(graph.getByLocation(graph.root.resolve(filepath)));
			}
		}
	} else {
		workspaces = await getWorkspaces({ step: setupStep });
	}

	if (workspaces.length === 0) {
		setupStep.info(
			'No Workspaces available for publishing. Follow instructions at https://onerepo.tools/core/changes/ for to version and publish Workspaces.',
		);
		await setupStep.end();
		return;
	}

	if (!skipAuth) {
		const isLoggedIn = await graph.packageManager.loggedIn({
			scope: workspaces[0].scope?.replace(/^@/, ''),
			registry: workspaces[0].publishablePackageJson!.publishConfig?.registry as string | undefined,
		});
		if (!isLoggedIn) {
			setupStep.error(
				'You do not appear to have publish rights to the configured registry. Either log in with your package manager or re-run this command with `--skip-auth` to continue.',
			);
			await setupStep.end();
			return;
		}
	}

	await setupStep.end();

	await runTasks('pre-publish', ['--workspaces', ...workspaces.map((ws) => ws.name)], graph);

	const configStep = logger.createStep('Apply publishConfig');
	for (const workspace of workspaces) {
		const newPackageJson = workspace.publishablePackageJson;
		await write(workspace.resolve('package.json'), JSON.stringify(newPackageJson, null, 2), { step: configStep });
	}
	await configStep.end();

	const otp = shouldRequestOtp ? await requestOtp() : undefined;

	const publishConfig =
		'publishConfig' in workspaces[0].packageJson ? (workspaces[0].packageJson.publishConfig as PublishConfig) : {};
	await graph.packageManager.publish({
		access: (publishConfig.access || 'public') as 'restricted' | 'public',
		workspaces,
		otp,
		tag: 'latest',
	});

	await runTasks('post-publish', ['--workspaces', ...workspaces.map((ws) => ws.name)], graph);
};
