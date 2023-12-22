import { run } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'astro';

export const description = 'Run astro commands.';

export const builder: Builder = (yargs) => yargs.usage('$0 astro');

export const handler: Handler = async (argv, { graph }) => {
	const { '--': rest = [], verbosity } = argv;

	if (rest.includes('dev')) {
		throw new Error('To run the dev server, please run `docs start`');
	}

	const ws = graph.getByLocation(__dirname);

	if (rest.includes('build')) {
		await run({
			name: 'Build TS defs',
			cmd: process.argv[1],
			args: ['tsc', '-a', `-${'v'.repeat(verbosity)}`],
			opts: {
				stdio: 'inherit',
			},
		});

		await run({
			name: 'Build API docs from source',
			cmd: process.argv[1],
			args: ['ws', ws.name, 'typedoc', `-${'v'.repeat(verbosity)}`],
			opts: {
				stdio: 'inherit',
			},
		});

		await run({
			name: 'Build API docs from source',
			cmd: process.argv[1],
			args: ['ws', ws.name, 'collect-content', `-${'v'.repeat(verbosity)}`],
			opts: {
				stdio: 'inherit',
			},
		});
	}

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
