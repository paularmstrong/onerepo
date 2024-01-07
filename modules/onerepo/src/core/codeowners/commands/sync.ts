import { write } from '@onerepo/file';
import type { Builder, Handler } from '@onerepo/yargs';
import { updateIndex } from '@onerepo/git';
import type { Providers } from '../get-codeowners';
import { codeownersFilepath, getCodeowners, providers } from '../get-codeowners';

export const command = 'sync';

export const description = 'Sync code owners from workspace configurations to the repository’s CODEOWNERS file.';

type Argv = {
	add: boolean;
	provider: Providers;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs
		.usage(`$0 ${command}`)
		.option('add', {
			type: 'boolean',
			description: 'Add the updated CODEOWNERS file to the git stage.',
			default: false,
		})
		.option('provider', {
			type: 'string',
			choices: providers,
			demandOption: true,
			description: 'Codeowner provider determines where the CODEOWNERS file(s) will be written.',
			hidden: true,
		});

export const handler: Handler<Argv> = async (argv, { graph }) => {
	const { add, provider } = argv;

	const filepath = codeownersFilepath(graph, provider);
	await write(filepath, getCodeowners(graph), { sign: true });

	if (add) {
		await updateIndex(filepath);
	}
};
