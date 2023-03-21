import { glob } from 'glob';
import type { RunSpec } from '@onerepo/subprocess';
import { batch } from '@onerepo/subprocess';
import { updateIndex } from '@onerepo/git';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = 'docgen';

export const description = 'Generate docs for the oneRepo core';

type Argv = {
	add: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.option('add', {
		type: 'boolean',
		default: false,
		description: 'Add all generated files to the git stage',
	});

export const handler: Handler<Argv> = async (argv, { graph, logger }) => {
	const { add, verbosity } = argv;

	const generators: Array<RunSpec> = [];
	const outFiles: Array<string> = [];

	const ws = graph.getByLocation(__dirname);

	const commands = await glob('*', { cwd: ws.resolve('src/core') });

	const findStep = logger.createStep('Determining workspaces');
	for (const cmd of commands) {
		const outFile = ws.resolve('docs', `${cmd}.md`);
		outFiles.push(outFile);

		generators.push({
			name: `Generate for ${cmd}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--format',
				'markdown',
				'--heading-level',
				'3',
				'--out-file',
				outFile,
				'--out-workspace',
				ws.name,
				`-${'v'.repeat(verbosity)}`,
				'--safe-write',
				'--command',
				cmd,
			],
			opts: {
				cwd: graph.root.location,
			},
			runDry: true,
		});
	}
	await findStep.end();

	await batch(generators);

	if (add) {
		await updateIndex(outFiles);
	}
};
