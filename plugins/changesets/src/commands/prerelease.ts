import pc from 'picocolors';
import inquirer from 'inquirer';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import type { Package, Packages } from '@manypkg/get-packages';
import type { ReleasePlan } from '@changesets/types';
import { read as readConfig } from '@changesets/config';
import { batch, run } from '@onerepo/subprocess';
import type { Builder, Handler } from '@onerepo/yargs';
import { getStatus } from '@onerepo/git';
import { applyPublishConfig, resetPackageJson } from '../publish-config';

export const command = ['prerelease', 'pre-release', 'pre'];

export const description = 'Pre-release available workspaces.';

type Args = {
	'allow-dirty': boolean;
	build: boolean;
	otp: boolean;
	'package-manager': 'yarn' | 'npm';
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
		.option('package-manager', {
			type: 'string',
			default: 'npm',
			choices: ['yarn', 'npm'],
			description: 'Package manager to use for publishing',
		} as const)
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
		'package-manager': packageManager,
		'skip-auth': skipAuth,
		verbosity,
	} = argv;

	if (!allowDirty) {
		const cleanStep = logger.createStep('Ensure clean working directory');
		const status = await getStatus({ step: cleanStep });
		if (status) {
			cleanStep.error(`Working directory must be unmodified to ensure safe pre-publish.
Commit or stash your changes to continue.

Current status is:\n ${status}`);
			await cleanStep.end();
			return;
		}
		await cleanStep.end();
	}

	const checkAuth = logger.createStep('Check auth');
	const isYarn = packageManager === 'yarn';
	if (!skipAuth) {
		await run({
			name: 'Ensure registry auth',
			cmd: isYarn ? 'yarn' : 'npm',
			args: [...(isYarn ? ['npm'] : []), 'whoami'],
			step: checkAuth,
		});
	}
	await checkAuth.end();

	const packageList: Array<Package> = Object.values(graph.workspaces).map(
		(ws) => ({ packageJson: applyPublishConfig(ws.packageJson), dir: ws.location } as Package)
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
					new inquirer.Separator('???'.repeat(20)),
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
					new inquirer.Separator('???'.repeat(20)),
				],
				pageSize: Math.min(hasChanges.size + 4, 20),
			},
		]);

		logger.warn(choices);

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

	const versionStep = logger.createStep('Get pre-release version');
	const [sha] = await run({
		name: 'Get commit sha',
		cmd: 'git',
		args: ['rev-parse', '--short', 'HEAD'],
		runDry: true,
		step: versionStep,
	});
	const newVersion = `0.0.0-pre.${sha}`;

	versionStep.warn(newVersion);
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

	let otp: string | void;
	if (otpRequired) {
		logger.pause();
		const { otp: inputOtp } = await inquirer.prompt([
			{
				type: 'input',
				name: 'otp',
				prefix: '????',
				message: 'Please enter your npm OTP:',
			},
		]);
		otp = inputOtp;
		logger.unpause();
	}

	await batch(
		workspaces.map((ws) => ({
			name: `Publish ${ws.name}`,
			cmd: isYarn ? 'yarn' : 'npm',
			args: [
				...(isYarn ? ['npm'] : []),
				'publish',
				'--tag',
				'prerelease',
				...(otp ? ['--otp', otp] : []),
				...(!isYarn && isDry ? ['--dry-run'] : []),
				...('access' in ws.publishConfig ? ['--access', ws.publishConfig.access!] : []),
			],
			opts: {
				cwd: ws.location,
			},
			runDry: !isYarn,
		}))
	);

	const resetStep = logger.createStep('Reset package.jsons');
	for (const workspace of graph.workspaces) {
		await resetPackageJson(workspace, { step: resetStep });
	}
	await resetStep.end();
};
