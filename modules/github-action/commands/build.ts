import { glob } from 'glob';
import { git, builders } from 'onerepo';
import type { Builder, Handler } from 'onerepo';

export const command = 'build';

export const description = 'Build public Workspaces using esbuild.';

type Args = builders.WithAffected &
	builders.WithWorkspaces & {
		version?: string;
	};

export const builder: Builder<Args> = (yargs) =>
	builders.withAffected(
		builders.withWorkspaces(
			yargs
				.usage('$0 build [options...]')
				.example('$0 build', 'Build all Workspaces.')
				.example('$0 build -w graph', 'Build the `graph` Workspace only.')
				.example('$0 build -w graph cli logger', 'Build the `graph`, `cli`, and `logger` workspaces.'),
		),
	);

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const workspace = graph.getByName('github-action');

	const files = await glob('*.ts', { cwd: workspace.resolve('src') });
	const procs = files.map((file) => ({
		name: `Build ${file}`,
		cmd: 'esbuild',
		args: [
			workspace.resolve('src', file),
			'--bundle',
			`--outdir=${workspace.resolve('dist')}`,
			'--platform=node',
			'--format=cjs',
			'--out-extension:.js=.cjs',
		],
	}));

	await graph.packageManager.batch(procs);

	await git.updateIndex(workspace.resolve('dist'));
};
