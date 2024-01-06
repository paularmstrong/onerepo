import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { constants } from 'node:fs';
import { compare } from 'semver';
import { run } from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { getLogger } from '@onerepo/logger';
import type { Builder, Handler } from '@onerepo/yargs';
import pkg from '../../../package.json';

export const command = 'install';

export const description = 'Install the oneRepo CLI into your environment.';

interface Args {
	force: boolean;
	location?: string;
	version: string;
}

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('force', {
			type: 'boolean',
			description: 'Force installation regardless of pre-existing command.',
			default: false,
		})
		.option('location', {
			type: 'string',
			description:
				'Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type.',
		})
		.version(false)
		.option('version', {
			type: 'string',
			description: 'Version of oneRepo to install. Defaults to the current version.',
			default: pkg.version,
		})
		.middleware((argv) => {
			const logger = getLogger();
			const { shell } = os.userInfo();
			if (!/\/(?:zsh|bash)$/.test(`${shell}`)) {
				logger.warn(
					`You are using an incompatible shell, "${shell}". To get the most out of ${argv.name}, switch to either zsh (preferred) or bash.`,
				);
			}
			if (os.platform() === 'win32') {
				logger.error(
					'Windows is not supported by oneRepo. Sorry, but we do not have sufficient resources for that. If you are interested in contributing and maintaining windows support long-term, please reach out on GitHub: https://github.com/paularmstrong/onerepo/discussions',
				);
				yargs.exit(1, new Error());
			}
		}, true)
		.middleware((argv) => {
			const { location } = argv;
			const { homedir } = os.userInfo();
			if (!location) {
				argv.location = `${homedir}/.onerepo`;
			}
		}, true);

export const handler: Handler<Args> = async function handler(argv, { logger }) {
	const { force, location, version } = argv;

	if (!force) {
		const step = logger.createStep('Check version');
		if (await file.exists(path.join(location!, 'package.json'), { step })) {
			const curPkgJsonRaw = await file.read(path.join(location!, 'package.json'), constants.O_RDONLY, {
				step,
			});
			const pkgJson = JSON.parse(curPkgJsonRaw);
			const comp = compare(pkgJson.version, version);
			if (comp > 0) {
				step.error(`Current version of oneRepo (${pkgJson.version}) is greater than the requested version (${version}).
Override this check by re-running with "--force".`);
				await step.end();
				return;
			}
		}
		step.end();
	}

	const installStep = logger.createStep('Install');

	await file.write(
		path.join(location!, 'package.json'),
		JSON.stringify(
			{
				name: 'onerepo-bin',
				version: version,
				type: 'module',
				workspaces: [],
			},
			null,
			2,
		),
		{ step: installStep },
	);

	await file.write(
		path.join(location!, 'onerepo.config.js'),
		`
export default {
	root: true,
};
`,
		{ step: installStep },
	);

	const binContents = `#!/usr/bin/env sh
BASEDIR=$(dirname $0)
node "$BASEDIR/one.js" $@
`;
	await file.remove(path.join(location!, 'bin'), { step: installStep });
	await file.copy(fileURLToPath(import.meta.url), path.join(location!, 'bin', 'one.js'), {
		step: installStep,
	});
	await file.write(path.join(location!, 'bin', 'one'), binContents, { step: installStep });
	await file.write(path.join(location!, 'bin', 'onerepo'), binContents, { step: installStep });

	await run({
		name: 'Make executable',
		cmd: 'chmod',
		args: ['a+x', path.join(location!, 'bin', 'one'), path.join(location!, 'bin', 'onerepo')],
		step: installStep,
	});

	await installStep.end();

	const environmentStep = logger.createStep('Update environment');
	const [completion] = await run({
		name: 'Get completion script',
		cmd: path.join(location!, 'bin', 'one'),
		args: ['onerepo-completion'],
		runDry: true,
		step: environmentStep,
	});

	const { homedir, shell } = os.userInfo();
	const filename = `${shell}`.endsWith('zsh') ? '.zshrc' : '.bash_profile';
	await file.writeSafe(
		path.join(homedir, filename),
		`
# These additions are automatically managed by oneRepo
# Any changes here can be reset by running "one install"
export PATH="$PATH:${location!}/bin"
${completion.replace(/^(#.*)/gm, '').replace(/\n+$/m, '')}`,
		{
			sentinel: 'onerepo-additions',
			step: environmentStep,
		},
	);

	environmentStep.info(`The oneRepo binary "one" has been added to your path, but you will need to reload your shell in order to start using it.
Please run the following or restart your terminal:

  source ${path.join(homedir, filename)}
  `);

	await environmentStep.end();
};
