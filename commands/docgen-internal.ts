import { batch, file, git, builders } from 'onerepo';
import type { Builder, Handler, RunSpec } from 'onerepo';

export const command = 'docgen-internal';

export const description = 'Generate docs for the oneRepo monorepo';

type Argv = {
	add: boolean;
} & builders.WithAllInputs;

export const builder: Builder<Argv> = (yargs) =>
	builders.withAllInputs(yargs).option('add', {
		type: 'boolean',
		default: false,
		description: 'Add all generated files to the git stage',
	});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, logger }) => {
	const { add, verbosity } = argv;
	const workspaces = await getWorkspaces();

	const generators: Array<RunSpec> = [];
	const outFiles: Array<string> = [];

	const findStep = logger.createStep('Determining workspaces');
	for (const ws of workspaces) {
		const bin = ws.resolve('bin', 'docgen.cjs');
		if (!(await file.exists(bin, { step: findStep }))) {
			continue;
		}

		const isPlugin = ws.name.startsWith('@onerepo/plugin-');

		const outFile = isPlugin ? ws.resolve('README.md') : ws.resolve('docs', 'usage.md');
		outFiles.push(outFile);

		generators.push({
			name: `Generate for ${ws.name}`,
			cmd: process.argv[1],
			args: [
				'docgen',
				'--bin',
				bin,
				'--format',
				'markdown',
				'--out-file',
				outFile,
				'--out-workspace',
				ws.name,
				`-${'v'.repeat(verbosity)}`,
				'--safe-write',
				...(isPlugin ? ['--command', ws.name.replace('@onerepo/plugin-', '')] : []),
			],
		});
	}
	await findStep.end();

	await batch(generators);

	if (add) {
		await git.updateIndex(outFiles);
	}
};
