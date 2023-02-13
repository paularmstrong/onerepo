import { run } from '@onerepo/subprocess';
import { exists } from '@onerepo/file';
import type { Builder, Handler } from '@onerepo/cli';

export const command = 'init';

export const description = 'Initialize changesets for this repository.';

export const builder: Builder = (yargs) => yargs.epilogue('You should only ever have to do this once.');

export const handler: Handler = async (argv, { graph, logger }) => {
	const step = logger.createStep('Check for existing configurations');
	if (await exists(graph.root.resolve('.changeset', 'config.json'), { step })) {
		step.warn('Changesets are already configured for this repository');
		await step.end();
		return;
	}
	await step.end();

	await run({
		name: 'Initialized changesets',
		cmd: 'npx',
		args: ['changesets', 'init'],
	});
};
