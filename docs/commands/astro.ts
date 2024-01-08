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

	const ws = graph.getByLocation(__dirname);

	const [bin] = await run({
		name: 'Get Astro',
		cmd: 'yarn',
		args: ['bin', 'astro'],
		runDry: true,
		opts: {
			cwd: ws.location,
		},
	});

	await run({
		name: 'Run astro',
		cmd: bin,
		args: rest,
		opts: {
			cwd: ws.location,
		},
	});
};
