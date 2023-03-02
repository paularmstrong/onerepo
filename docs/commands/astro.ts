import { run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'astro';

export const description = 'Run astro commands.';

export const builder: Builder = (yargs) => yargs.usage('$0 astro');

export const handler: Handler = async (argv, { graph }) => {
	const { '--': rest = [] } = argv;

	if (rest.includes('dev')) {
		throw new Error('To run the dev server, please run `docs start`');
	}

	await run({
		name: 'Run astro',
		cmd: 'npx',
		args: ['astro', ...rest],
		opts: {
			cwd: graph.getByLocation(__dirname).location,
		},
	});
};
