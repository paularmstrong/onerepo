import path from 'node:path';
import { platform } from 'os';
import type { Builder, Handler } from '@onerepo/cli';
import { file, logger, run } from '@onerepo/cli';
import { userInfo } from 'os';

export const command = 'install';

export const description = 'Install the oneRepo CLI into your environment.';

interface Args {
	force: boolean;
	name: string;
	location?: string;
}

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('force', {
			type: 'boolean',
			description: 'Force installation regardless of pre-existing command.',
			default: false,
		})
		.option('name', {
			type: 'string',
			description: 'Name of the command to install',
			demandOption: true,
		})
		.option('location', {
			type: 'string',
			description:
				'Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type.',
		})
		.middleware((argv) => {
			const { shell } = userInfo();
			if (!/\/(?:zsh|bash)$/.test(shell)) {
				logger.warn(
					`You are using an incompatible shell, "${shell}". To get the most out of ${argv.name}, switch to either zsh (preferred) or bash.`
				);
			}
			if (platform() === 'win32') {
				logger.error(
					new Error('Windows is not supported by oneRepo. Sorry, but there are not sufficient resources for that :(')
				);
				process.exit(1);
			}
		})
		.middleware((argv) => {
			const { location } = argv;
			const { homedir } = userInfo();
			if (!location) {
				argv.location = platform() === 'darwin' ? '/usr/local/bin' : `${homedir}/bin`;
			}
		})
		.epilogue(
			'`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.'
		)
		.epilogue(
			'As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).'
		);

export const handler: Handler<Args> = async function handler(argv) {
	const { force, location, name } = argv;

	if (!force) {
		let which: string = '';
		const step = logger.createStep(`Ensure ${name} does not exist`);
		try {
			const [out] = await run({
				name: `which ${name}?`,
				cmd: 'which',
				args: [name],
				step,
			});
			which = out;
		} catch (e) {
			//nothing
		}
		if (which) {
			if (which) {
				step.error(`Refusing to install with name \`${name}\` because it already exists at \`${which}\`

To force installation, re-run this command with \`--force\`:
  ${path.relative(process.cwd(), process.argv[1])} ${command} --name=${name} --location=${location} --force`);
			}
			await step.end();
			return Promise.reject();
		}
	}

	await file.writeFile(path.join(location!, name), `#!/bin/zsh\n\n${process.argv[1]} $@`);
	await run({
		name: 'Make executable',
		cmd: 'chmod',
		args: ['a+x', path.join(location!, name)],
	});

	const [completion] = await run({
		name: 'Get completion script',
		cmd: process.argv[1],
		args: [`${name}-completion`],
		runDry: true,
	});

	const { homedir, shell } = userInfo();
	const filename = shell.endsWith('zsh') ? '.zshrc' : '.bash_profile';
	await file.writeFileContents(path.join(homedir, filename), completion.replace(/\n+$/m, ''), {
		sentinel: `${name}-cmd-completions`,
	});
};
