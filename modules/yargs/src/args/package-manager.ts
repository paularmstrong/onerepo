import type { Argv as Yargv } from 'yargs';
import path from 'node:path';
import * as file from '@onerepo/file';

const packageManagerKey = 'package-manager';
const choices = ['yarn', 'npm'] as const;

export type PackageManagerArgs = {
	[packageManagerKey]?: (typeof choices)[number];
};

export function setUpPackageManagerArg<Args extends PackageManagerArgs>(yarg: Yargv<Args>) {
	return yarg
		.option(packageManagerKey, {
			type: 'string',
			description: 'Package manager to install dependencies with',
			choices,
		})
		.middleware((argv) => {
			if (!argv[packageManagerKey]) {
				// Set value to yarn if lockfile exists
				return file.exists(path.join(__dirname, '../../../../yarn.lock'), { noStep: true }).then((exists) => {
					argv[packageManagerKey] = choices[exists ? 0 : 1];
				});
			}
		});
}
