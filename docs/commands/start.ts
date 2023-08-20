import { run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'start';

export const description = 'Start the docs development server';

export const builder: Builder = (yargs) => yargs.usage('$0 start');

export const handler: Handler = async (argv, { graph }) => {
	const ws = graph.getByLocation(__dirname);

	await run({
		name: 'Build API docs from source',
		cmd: process.argv[1],
		args: ['ws', ws.name, 'typedoc'],
		opts: {
			stdio: 'inherit',
		},
	});

	await run({
		name: 'Build API docs from source',
		cmd: process.argv[1],
		args: ['ws', ws.name, 'collect-content'],
		opts: {
			stdio: 'inherit',
		},
	});

	await graph.packageManager.run({
		name: 'Run astro',
		cmd: 'netlify',
		args: ['dev'],
		opts: {
			cwd: ws.location,
			stdio: 'inherit',
		},
	});
};
