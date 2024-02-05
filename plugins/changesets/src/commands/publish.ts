import inquirer from 'inquirer';
import pc from 'picocolors';
import { write } from '@onerepo/file';
import { run } from '@onerepo/subprocess';
import { getBranch, isClean } from '@onerepo/git';
import type { Builder, Handler } from '@onerepo/yargs';
import type { PublishConfig } from 'onerepo';
import { resetPackageJson } from '../publish-config';

export const command = ['publish', 'release'];

export const description = 'Publish all Workspaces with versions not available in the registry.';

type Args = {
	'allow-dirty': boolean;
	build: boolean;
	otp: boolean;
	'skip-auth': boolean;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.usage('$0 release [options...]')
		.option('allow-dirty', {
			type: 'boolean',
			default: false,
			hidden: true,
			description: 'Bypass checks to ensure no local changes before publishing.',
		})
		.option('build', {
			type: 'boolean',
			description: 'Build Workspaces before publishing',
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
		})
		.epilogue(
			'This command is safe to run any time – only packages that have previously gone through the `version` process will end up being published.',
		);

export const handler: Handler<Args> = async (argv, { graph, logger }) => {
	const { 'allow-dirty': allowDirty, build, otp: otpRequired, 'skip-auth': skipAuth, verbosity } = argv;

	if (!allowDirty) {
		const cleanStep = logger.createStep('Ensure clean working directory');
		const branch = await getBranch({ step: cleanStep });
		if (branch !== process.env.ONEREPO_HEAD_BRANCH) {
			cleanStep.error(
				`Publish is only available from the branch "${process.env.ONEREPO_HEAD_BRANCH}", but you are currently on "${branch}". Please switch branches and re-run to continue.`,
			);
			await cleanStep.end();
			return;
		}

		if (!(await isClean({ step: cleanStep }))) {
			cleanStep.error(
				`Working directory must be unmodified to ensure safe publish.\nAdvanced: Skip this check with \`--allow-dirty\`.`,
			);
			await cleanStep.end();
			return;
		}
		await cleanStep.end();
	}

	const infoStep = logger.createStep('Get version info');

	const workspaces = Object.values(graph.workspaces).filter((ws) => !ws.private);
	const publishable = await graph.packageManager.publishable(workspaces);

	if (publishable.length === 0) {
		infoStep.warn('No workspaces need publishing.');
		await infoStep.end();
		return;
	}

	infoStep.info(() => `Publishing:\n${publishable.map((ws) => `  - ${ws.name}`).join('\n')}`);
	await infoStep.end();

	if (!skipAuth) {
		const isLoggedIn = await graph.packageManager.loggedIn({
			scope: publishable[0].scope?.replace(/^@/, ''),
			registry: workspaces[0].publishablePackageJson!.publishConfig?.registry as string | undefined,
		});
		if (!isLoggedIn) {
			logger.error(
				'You do not appear to have publish rights to the configured registry. Either log in with your package manager or re-run this command with `--skip-auth` to continue.',
			);
			return;
		}
	}

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
				...publishable.map((ws) => ws.name),
				...(verbosity ? [`-${'v'.repeat(verbosity)}`] : []),
			],
			runDry: true,
		});
	}

	const configStep = logger.createStep('Apply publishConfig');
	for (const workspace of publishable) {
		const newPackageJson = workspace.publishablePackageJson;
		await write(workspace.resolve('package.json'), JSON.stringify(newPackageJson, null, 2), { step: configStep });
	}
	await configStep.end();

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

	const publishConfig =
		'publishConfig' in publishable[0].packageJson ? (publishable[0].packageJson.publishConfig as PublishConfig) : {};
	await graph.packageManager.publish({
		access: (publishConfig.access || 'public') as 'restricted' | 'public',
		workspaces: publishable,
		otp,
		tag: 'latest',
	});

	const resetStep = logger.createStep('Reset package.jsons');
	for (const workspace of workspaces) {
		await resetPackageJson(workspace, { step: resetStep });
	}
	await resetStep.end();
};
