import inquirer from 'inquirer';
import applyReleasePlan from '@changesets/apply-release-plan';
import readChangesets from '@changesets/read';
import type { Package, Packages } from '@manypkg/get-packages';
import type { ReleasePlan } from '@changesets/types';
import { read as readConfig } from '@changesets/config';
import { batch, run } from '@onerepo/cli';
import type { Builder, Handler } from '@onerepo/cli';

export const command = ['prerelease', 'pre-release', 'pre'];

export const description = 'Pre-release available workspaces.';

type Args = {
	build: boolean;
	otp: boolean;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('build', {
			type: 'boolean',
			description: 'Build workspaces before publishing',
			default: true,
		})
		.option('otp', {
			type: 'boolean',
			description: 'Set to true if your publishes require an OTP for NPM.',
			default: false,
		});

export const handler: Handler<Args> = async (argv, { graph, logger }) => {
	const { build, 'dry-run': isDry, otp: otpRequired } = argv;

	// TODO: check npm whoami

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

	const hasChanges = new Set<string>();
	changesets.forEach(({ releases }) => {
		releases.forEach(({ name }) => hasChanges.add(name));
	});

	logger.pause();
	const { choices } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'choices',
			message: 'Which workspaces would you like to release?',
			choices: ['All', new inquirer.Separator('With changes'), ...Array.from(hasChanges)],
		},
	]);
	logger.unpause();

	const workspaces = graph
		.getAllByName(choices.includes('All') ? graph.dependents() : graph.dependents(choices, true))
		.filter((ws) => !ws.private);

	const [sha] = await run({
		name: 'Get commit sha',
		cmd: 'git',
		args: ['rev-parse', '--short', 'HEAD'],
		runDry: true,
	});
	const newVersion = `0.0.0-pre.${sha}`;

	const releases: ReleasePlan['releases'] = workspaces.map((ws) => ({
		name: ws.name,
		type: 'none',
		oldVersion: ws.name,
		newVersion,
		changesets: [],
	}));

	logger.debug('Chosen releases:');
	logger.debug(releases);

	if (!isDry) {
		await applyReleasePlan({ changesets: [], releases, preState: undefined } as ReleasePlan, packages, config);
	}

	if (build) {
		await run({
			name: `Build workspaces`,
			cmd: process.argv[1],
			args: ['build', '-w', ...workspaces.map((ws) => ws.name)],
			runDry: true,
		});
	}

	let otp: string | void;
	if (otpRequired) {
		logger.pause();
		const { otp: inputOtp } = await inquirer.prompt([
			{
				type: 'input',
				name: 'otp',
				prefix: '🔐',
				message: 'Please enter your npm OTP:',
			},
		]);
		otp = inputOtp;
		logger.unpause();
	}

	await batch(
		workspaces.map((ws) => ({
			name: `Publish ${ws.name}`,
			cmd: 'npm',
			args: [
				'publish',
				'--access',
				'public',
				'--tag',
				'prerelease',
				...(otp ? ['--otp', otp] : []),
				...(isDry ? ['--dry-run'] : []),
			],
			opts: {
				cwd: ws.resolve('dist'),
			},
			runDry: true,
		}))
	);

	await run({
		name: 'Reset package.json files',
		cmd: 'git',
		args: ['restore', ...workspaces.map((ws) => ws.resolve('package.json'))],
	});
};
