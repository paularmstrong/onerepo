import glob from 'glob';
import { batch, git } from 'onerepo';
import type { Builder, Handler, RunSpec } from 'onerepo';

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

	const ws = graph.getByLocation(__dirname)!;

	const commands = glob.sync('*', { cwd: ws.resolve('src/core') });
	const bin = ws.resolve('bin', 'docgen.cjs');

	const findStep = logger.createStep('Determining workspaces');
	for (const cmd of commands) {
		const outFile = `docs/${cmd}.md`;
		outFiles.push(outFile);

		generators.push({
			name: `Generate for ${cmd}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--bin',
				bin,
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
		});
	}
	await findStep.end();

	await batch(generators);

	if (add) {
		await git.updateIndex(outFiles);
	}
};
