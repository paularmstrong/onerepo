import { run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'start';

export const description = 'Start the docs development server';

export const builder: Builder = (yargs) => yargs.usage('$0 start');

export const handler: Handler = async (argv, { graph }) => {
	await run({
		name: 'Run astro',
		cmd: 'npx',
		args: ['netlify', 'dev'],
		opts: {
			cwd: graph.getByLocation(__dirname)!.location,
			stdio: 'inherit',
		},
	});
};
