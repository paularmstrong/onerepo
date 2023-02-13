// import inquirer from 'inquirer';
// import { batch, run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'publish';

export const description = 'Build public workspaces using esbuild.';

type Args = {
	build: boolean;
	otp: boolean;
	pre: boolean;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.usage(`$0 ${command} [options]`)
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
		.option('pre', {
			type: 'boolean',
			description: 'Create a pre-release',
			default: false,
		});

// TODO: workspaces vs affected as reusable builder bits
export const handler: Handler<Args> = async function handler() {
	// const { build, 'dry-run': isDry, otp: otpRequired, pre } = argv;
	// let newVersion = '';
	// if (pre) {
	// 	const [out] = await run({
	// 		name: 'Get commit hash',
	// 		cmd: 'git',
	// 		args: ['rev-parse', '--short', 'HEAD'],
	// 		runDry: true,
	// 	});
	// 	newVersion = `0.0.0-pre.${out}`;
	// }
	// const toBuild: Array<string> = [];
	// const publishes: Array<RunSpec> = [];
	// const publishable = Object.values(graph.workspaces).filter((ws) => !ws.private);
	// const results = await batch(
	// 	publishable.map((ws) => ({
	// 		name: `Get versions of ${ws.name}`,
	// 		cmd: 'npm',
	// 		args: ['info', ws.name, '--json'],
	// 		runDry: true,
	// 		skipFailures: true,
	// 	}))
	// );
	// logger.debug(results);
	// for (const ws of Object.values(graph.workspaces)) {
	// 	if (ws.private) {
	// 		continue;
	// 	}
	// 	try {
	// 		const [versionCheck] = await run({
	// 			name: `Get versions of ${ws.name}`,
	// 			cmd: 'npm',
	// 			args: ['info', ws.name, '--json'],
	// 			runDry: true,
	// 			skipFailures: true,
	// 		});
	// 		if (versionCheck.includes(pre ? newVersion : ws.version!)) {
	// 			logger.warn(`Not publishing ${ws.name} because ${newVersion || ws.version!} already exists.`);
	// 			continue;
	// 		}
	// 	} catch (e) {
	// 		// no worries
	// 	}
	// 	if (build) {
	// 		toBuild.push(ws.name);
	// 	}
	// 	publishes.push({
	// 		name: `Publish ${ws.name}`,
	// 		cmd: 'npm',
	// 		args: ['publish', '--access', 'public', ...(isDry ? ['--dry-run'] : []), ...(pre ? ['--tag', 'prerelease'] : [])],
	// 		opts: {
	// 			cwd: ws.resolve('dist'),
	// 		},
	// 		runDry: true,
	// 	});
	// }
	// await run({
	// 	name: `Build workspaces`,
	// 	cmd: process.argv[1],
	// 	args: ['build', '-w', ...toBuild, ...(pre ? ['--version', newVersion] : [])],
	// 	runDry: true,
	// });
	// let otp: string | void;
	// if (otpRequired) {
	// 	logger.inherit = true;
	// 	const { otp: inputOtp } = await inquirer.prompt([
	// 		{
	// 			type: 'input',
	// 			name: 'otp',
	// 			prefix: '🔐',
	// 			message: 'Please enter your npm OTP:',
	// 		},
	// 	]);
	// 	otp = inputOtp;
	// 	logger.inherit = false;
	// }
	// await batch(publishes.map((pub) => ({ ...pub, args: [...(pub.args || []), ...(otp ? ['--otp', otp] : [])] })));
};
