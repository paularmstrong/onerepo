import path from 'node:path';
import os from 'node:os';
import { run, sudo } from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { logger } from '@onerepo/logger';
import type { Builder, Handler } from '@onerepo/yargs';

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
			const { shell } = os.userInfo();
			if (!/\/(?:zsh|bash)$/.test(shell)) {
				logger.warn(
					`You are using an incompatible shell, "${shell}". To get the most out of ${argv.name}, switch to either zsh (preferred) or bash.`
				);
			}
			if (os.platform() === 'win32') {
				logger.error(
					new Error(
						'Windows is not supported by oneRepo. Sorry, but we do not have sufficient resources for that. If you are interested in contributing and maintaining windows support long-term, please reach out on GitHub: https://github.com/paularmstrong/onerepo/discussions'
					)
				);
				process.exit(1);
			}
		})
		.default('verbosity', 2)
		.middleware((argv) => {
			const { location } = argv;
			const { homedir } = os.userInfo();
			if (!location) {
				argv.location = os.platform() === 'darwin' ? '/usr/local/bin' : `${homedir}/bin`;
			}
		})
		.epilogue(
			'`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.'
		)
		.epilogue(
			'As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).'
		);

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { force, location, name } = argv;

	if (!force) {
		const step = logger.createStep(`Ensure ${name} does not exist`);
		const [which] = await run({
			name: `which ${name}?`,
			cmd: 'which',
			args: [name],
			step,
			skipFailures: true,
		});

		if (which) {
			const contents = await file.read(which, 'r', { step });
			if (!contents.includes(process.argv[1])) {
				step.error(`Refusing to install with name \`${name}\` because it already exists at \`${which}\`

				To force installation, re-run this command with \`--force\`:
					${path.relative(process.cwd(), process.argv[1])} ${command} --name=${name} --location=${location} --force`);
				await step.end();
				return Promise.reject();
			}

			step.warn(
				`"${name}" has already been installed. It should be safe to overwrite previous installation. Continuing…`
			);
		}
		await step.end();
	}

	const installLocation = path.join(location!, name);

	await sudo({
		name: 'Create executable',
		cmd: 'echo',
		args: [`"#!/bin/zsh\n\n${process.argv[1]} \\$@"`, '|', 'sudo', 'tee', installLocation],
	});

	await sudo({
		name: 'Make executable',
		cmd: 'chmod',
		args: ['a+x', installLocation],
	});

	const [completion] = await run({
		name: 'Get completion script',
		cmd: process.argv[1],
		args: [`${name}-completion`],
		runDry: true,
	});

	const { homedir, shell } = os.userInfo();
	const filename = shell.endsWith('zsh') ? '.zshrc' : '.bash_profile';
	await file.writeSafe(path.join(homedir, filename), completion.replace(/\n+$/m, ''), {
		sentinel: `${name}-cmd-completions`,
	});

	if (await file.exists(graph.root.resolve('.husky'))) {
		await run({
			name: 'Install git hooks',
			cmd: 'npx',
			args: ['husky', 'install'],
		});
	}
};
