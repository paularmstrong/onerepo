import pc from 'picocolors';
import inquirer from 'inquirer';
import changesetApply from '@changesets/apply-release-plan';
import changesetRead from '@changesets/read';
import { read as readConfig } from '@changesets/config';
import { run } from '@onerepo/subprocess';
import { isClean } from '@onerepo/git';
import type { Builder, Handler } from '@onerepo/yargs';
import type { ReleasePlan } from '@changesets/types';
import type { Package, Packages } from '@manypkg/get-packages';
import { applyPublishConfig, resetPackageJson } from '../publish-config';

// Changesets does not properly document its ESM exports in package.json, so this gets funky
const applyReleasePlan = (
	'default' in changesetApply ? changesetApply.default : changesetApply
) as typeof changesetApply;
const readChangesets = ('default' in changesetRead ? changesetRead.default : changesetRead) as typeof changesetRead;

export const command = ['prerelease', 'pre-release', 'pre'];

export const description = 'Pre-release available workspaces.';

type Args = {
	'allow-dirty': boolean;
	build: boolean;
	otp: boolean;
	'skip-auth': boolean;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.usage('$0 prerelease')
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			hidden: true,
			description: 'Bypass checks to ensure no local changes before publishing.',
		})
		.option('build', {
			type: 'boolean',
			description: 'Build workspaces before publishing',
			default: true,
		})
		.option('otp', {
			type: 'boolean',
			description: 'Set to true if your publishes require an OTP for NPM.',
			default: false,
		})
		.option('skip-auth', {
			type: 'boolean',
			description: 'Skip NPM auth check. This may be necessary for some internal registries using PATs or tokens.',
			default: false,
		});

export const handler: Handler<Args> = async (argv, { graph, logger }) => {
	const {
		'allow-dirty': allowDirty,
		build,
		'dry-run': isDry,
		otp: otpRequired,
		'skip-auth': skipAuth,
		verbosity,
	} = argv;

	if (!allowDirty) {
		const cleanStep = logger.createStep('Ensure clean working directory');
		if (!(await isClean({ step: cleanStep }))) {
			cleanStep.error(`Working directory must be unmodified to ensure safe pre-publish.
Commit or stash your changes to continue.`);
			await cleanStep.end();
			return;
		}
		await cleanStep.end();
	}

	const packageList: Array<Package> = Object.values(graph.workspaces).map(
		(ws) => ({ packageJson: applyPublishConfig(ws.packageJson), dir: ws.location }) as Package,
	);
	const packages: Packages = {
		tool: 'root',
		packages: packageList,
		root: { packageJson: applyPublishConfig(graph.root.packageJson), dir: graph.root.location } as Package,
	};

	const config = await readConfig(graph.root.location, packages);
	const changesets = await readChangesets(graph.root.location);

	const hasChanges = new Set<string>();
	changesets.forEach(({ releases }) => {
		releases.forEach(({ name }) => hasChanges.add(name));
	});

	let workspaces = Object.values(graph.workspaces).filter((ws) => !ws.private);
	if (hasChanges.size > 0) {
		logger.pause();
		const { choices } = await inquirer.prompt([
			{
				type: 'checkbox',
				name: 'choices',
				message: 'Which workspaces would you like to release?',
				choices: [
					{ name: pc.bold('All workspaces'), value: '_ALL_' },
					new inquirer.Separator('⎯'.repeat(20)),
					new inquirer.Separator(' Workspaces with changesets\n'),
					...Array.from(hasChanges)
						.sort()
						.map((name) => {
							if (!name.includes('/')) {
								return name;
							}
							const [scope, shortname] = name.split('/');
							return { name: `${pc.dim(scope)}/${shortname}`, value: name };
						}),
					new inquirer.Separator('⎯'.repeat(20)),
				],
				pageSize: Math.min(hasChanges.size + 4, 20),
				validate: (input) => {
					if (!input.length) {
						return `${pc.bold(pc.red('Error:'))} Please select at least one workspace.`;
					}
					return true;
				},
			},
		]);

		logger.info(choices);

		if (!choices.includes('_ALL_')) {
			workspaces = graph.dependencies(choices, true).filter((ws) => !ws.private);
		}

		if (choices.length === 0) {
			logger.warn('No workspaces were selected so nothing will be published.');
			return;
		}

		logger.unpause();
	} else {
		logger.warn('No changesets found. Defaulting to all workspaces.');
	}

	if (!skipAuth) {
		const isLoggedIn = await graph.packageManager.loggedIn({
			scope: workspaces[0].scope?.replace(/^@/, ''),
			registry: workspaces[0].publishConfig.registry,
		});
		if (!isLoggedIn) {
			logger.error(
				'You do not appear to have publish rights to the configured registry. Either log in with your package manager or re-run this command with `--skip-auth` to continue.',
			);
			return;
		}
	}

	const versionStep = logger.createStep('Get pre-release version');
	const [sha] = await run({
		name: 'Get commit sha',
		cmd: 'git',
		args: ['rev-parse', '--short', 'HEAD'],
		runDry: true,
		step: versionStep,
	});
	const newVersion = `0.0.0-pre.${sha}`;

	versionStep.info(`The following version will be used for all published workspaces: ${newVersion}`);
	await versionStep.end();

	const releases: ReleasePlan['releases'] = workspaces.map((ws) => ({
		name: ws.name,
		type: 'none',
		oldVersion: ws.version!,
		newVersion,
		changesets: [],
	}));

	logger.debug('Chosen releases:');
	logger.debug(releases);

	if (build) {
		await run({
			name: 'Build workspaces',
			cmd: process.argv[1],
			args: [
				'tasks',
				'-c',
				'build',
				'--no-affected',
				'-w',
				...workspaces.map((ws) => ws.name),
				verbosity ? `-${'v'.repeat(verbosity)}` : '',
			].filter(Boolean),
			runDry: true,
			opts: {
				stdio: 'inherit',
			},
		});
	}

	if (!isDry) {
		await applyReleasePlan({ changesets: [], releases, preState: undefined } as ReleasePlan, packages, config);
	}

	let otp: string | undefined;
	if (otpRequired) {
		logger.pause();
		const { otp: inputOtp } = await inquirer.prompt([
			{
				type: 'input',
				name: 'otp',
				prefix: '🔐',
				message: 'Please enter your npm OTP:',
				validate: (input) => {
					if (!input) {
						return `${pc.bold(pc.red('Error:'))} Please enter a one-time passcode.`;
					}
					return true;
				},
			},
		]);
		otp = inputOtp;
		logger.unpause();
	}

	await graph.packageManager.publish({
		access: workspaces[0].publishConfig?.access ?? 'public',
		workspaces,
		otp,
		tag: 'prerelease',
	});

	const resetStep = logger.createStep('Reset package.jsons');
	for (const workspace of graph.workspaces) {
		await resetPackageJson(workspace, { step: resetStep });
	}
	await resetStep.end();
};
