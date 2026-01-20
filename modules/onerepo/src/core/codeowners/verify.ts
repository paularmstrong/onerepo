import * as core from '@actions/core';
import { read, signContents, verifySignature } from '@onerepo/file';
import type { Builder, Handler } from '@onerepo/yargs';
import type { Providers } from './get-codeowners';
import { codeownersFilepath, getCodeownersContents } from './get-codeowners.ts';

export const command = 'verify';

export const description = 'Verify the CODEOWNERS file is up to date and unmodified.';

export const providers: Array<Providers> = ['github', 'gitlab', 'gitea', 'bitbucket'] as const;

type Argv = {
	provider: Providers;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 ${command}`).option('provider', {
		type: 'string',
		choices: providers,
		demandOption: true,
		description: 'Codeowner provider determines where the CODEOWNERS file(s) will be written.',
		hidden: true,
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { provider, $0 } = argv;

	const filepath = codeownersFilepath(graph, provider);

	const verifyStep = logger.createStep('Verify signature');
	const contents = await read(filepath, 'r', { step: verifyStep });
	if (verifySignature(contents) !== 'valid') {
		const msg = `Code owners file (${filepath}) was manually modified, but is a generated file. Please run the following and commit the change to fix this issue:

  ${$0} codeowners sync --add
\u0000`;
		annotate(msg, filepath);
		verifyStep.error(msg);
		await verifyStep.end();
		return;
	}
	await verifyStep.end();

	const compareStep = logger.createStep('Verify up to date');
	if (contents !== (await signContents(filepath, getCodeownersContents(graph), { step: compareStep }))) {
		const msg = `Code owners file is not up to date. Please run the following and commit the changes to fix this issue:

  ${$0} codeowners sync --add
\u0000`;
		annotate(msg, filepath);
		compareStep.error(msg);
		await compareStep.end();
		return;
	}
	await compareStep.end();
};

function annotate(msg: string, filepath: string) {
	if (process.env.GITHUB_RUN_ID) {
		core.error(msg, { file: filepath });
	}
}
