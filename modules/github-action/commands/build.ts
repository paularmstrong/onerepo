import { glob } from 'glob';
import { git, batch, run, builders } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'build';

export const description = 'Build public workspaces using esbuild.';

type Args = builders.WithAffected &
	builders.WithWorkspaces & {
		version?: string;
	};

export const builder: Builder<Args> = (yargs) =>
	builders.withAffected(
		builders.withWorkspaces(
			yargs
				.usage('$0 build [options]')
				.version(false)
				.example('$0 build', 'Build all workspaces.')
				.example('$0 build -w graph', 'Build the `graph` workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` workspaces.'),
		),
	);

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const workspace = graph.getByLocation(__dirname);

	const [esbuildBin] = await run({
		name: 'Get esbuild bin',
		cmd: 'yarn',
		args: ['bin', 'esbuild'],
		opts: { cwd: graph.root.location },
	});

	const files = await glob('*.ts', { cwd: workspace.resolve('src') });
	const procs = files.map((file) => ({
		name: `Build ${file}`,
		cmd: esbuildBin,
		args: [
			workspace.resolve('src', file),
			'--bundle',
			`--outdir=${workspace.resolve('dist')}`,
			'--platform=node',
			'--format=cjs',
			'--out-extension:.js=.cjs',
		],
	}));

	await batch(procs);

	await git.updateIndex(workspace.resolve('dist'));
};
