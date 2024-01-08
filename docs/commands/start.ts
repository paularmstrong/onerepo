import type { Builder, Handler } from 'onerepo';

export const command = 'start';

export const description = 'Start the docs development server';

type Argv = {
	netlify: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage('$0 start').option('netlify', {
		alias: 'n',
		type: 'boolean',
		default: false,
		description: 'Run with the Netlify CLI',
	});

export const handler: Handler<Argv> = async (argv, { graph }) => {
	const { netlify } = argv;

	const ws = graph.getByLocation(__dirname);

	await graph.packageManager.run({
		name: 'Run astro',
		cmd: netlify ? 'netlify' : 'astro',
		args: ['dev'],
		opts: {
			cwd: ws.location,
			stdio: 'inherit',
		},
	});
};
