import { updateIndex } from '@onerepo/git';
import { run } from '@onerepo/subprocess';
import { withAllInputs } from '@onerepo/cli';
import type { Builder, Handler, WithAllInputs } from '@onerepo/cli';
import { logger } from '@onerepo/logger';

export const command = 'prettier';

export const description = 'Format files with prettier';

type Args = {
	add?: boolean;
	check?: boolean;
} & WithAllInputs;

export const builder: Builder<Args> = (yargs) =>
	withAllInputs(yargs)
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write',
			conflicts: ['all', 'check'],
		})
		.option('check', {
			description: 'Check for changes.',
			type: 'boolean',
		});

export const handler: Handler<Args> = async function handler(argv, { getFilepaths }) {
	const { add, all, check, 'dry-run': isDry } = argv;

	const paths: Array<string> = await getFilepaths();

	if (paths.length === 0) {
		logger.warn('No filepaths to check for formatting');
		return;
	}

	await run({
		name: `Format files ${all ? '' : paths.join(', ').substring(0, 60)}…`,
		cmd: 'npx',
		args: ['prettier', '--ignore-unknown', isDry || check ? '--list-different' : '--write', ...paths],
	});

	if (add) {
		await updateIndex(paths);
	}
};
