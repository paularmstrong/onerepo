import { batch, file, git, withAllInputs } from '@onerepo/cli';
import type { Builder, Handler, RunSpec, WithAllInputs } from '@onerepo/cli';

export const command = 'docgen-internal';

export const description = 'Generate docs for the oneRepo monorepo';

type Argv = {
	add: boolean;
} & WithAllInputs;

export const builder: Builder<Argv> = (yargs) =>
	withAllInputs(yargs).option('add', {
		type: 'boolean',
		default: false,
		description: 'Add all generated files to the git stage',
	});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, logger }) => {
	const { add } = argv;
	const workspaces = await getWorkspaces();

	const generators: Array<RunSpec> = [];
	const outFiles: Array<string> = [];

	const findStep = logger.createStep('Determining workspaces');
	for (const ws of workspaces) {
		if (!ws.name.includes('plugin-')) {
			continue;
		}

		const bin = ws.resolve('bin', 'docgen.cjs');
		if (!(await file.exists(bin, { step: findStep }))) {
			continue;
		}

		const outFile = ws.resolve('docs', 'cli.md');
		outFiles.push(outFile);

		generators.push({
			name: `Generate for ${ws.name}`,
			cmd: process.argv[1],
			args: ['docgen', '--bin', bin, '--format', 'markdown', '--out-file', outFile, '--out-workspace', ws.name],
		});
	}
	await findStep.end();

	await batch(generators);

	if (add) {
		await git.updateIndex(outFiles);
	}
};
