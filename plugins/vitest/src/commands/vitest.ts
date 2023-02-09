import { git, run } from '@onerepo/cli';
import type { Builder, Handler } from '@onerepo/cli';
import type { Workspace } from '@onerepo/graph';

export const command = 'test';

export const description = 'Run unit tests';

type Args = {
	affected?: boolean;
	all?: boolean;
	files?: Array<string>;
	inspect: boolean;
	workspaces?: Array<string>;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.usage('$0 test [options]')
		.epilogue(
			`This command also accepts any argument that [vitest accepts](https://vitest.dev/guide/cli.html) and passes them through.`
		)
		.example('$0 test --watch', 'Run vitest in --watch mode.')
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Lint all files unconditionally',
		})
		.option('affected', {
			type: 'boolean',
			description: 'Run tests related to all affected workspaces',
			conflicts: ['all', 'files', 'workspaces'],
		})
		.option('inspect', {
			type: 'boolean',
			description: 'Break for the the Node inspector to debug tests',
			default: false,
		})
		.option('workspaces', {
			alias: 'ws',
			type: 'array',
			string: true,
			description: 'List of workspace names to restrict linting against',
			conflicts: ['all', 'files'],
		});

export const handler: Handler<Args> = async function handler(argv, { graph, getAffected }) {
	const {
		_: [, ...positionals],
		'--': other = [],
		affected,
		workspaces: workspaceNames,
		inspect,
	} = argv;

	const related: Array<string> = [];
	const paths: Array<string> = [];

	let workspaces: Array<Workspace> = [];
	if (workspaceNames) {
		workspaces = graph.getAllByName(workspaceNames);
		workspaces.forEach((ws) => {
			paths.join(ws.location);
		});
	} else if (affected) {
		workspaces = await getAffected();
	} else if (!positionals) {
		const { all } = await git.getModifiedFiles();
		related.push(...all);
		related.unshift('related');
	}

	await run({
		name: 'Run tests',
		cmd: inspect ? 'node' : 'node_modules/.bin/vitest',
		args: [
			...(inspect ? ['--inspect', '--inspect-brk', 'node_modules/.bin/vitest'] : []),
			'--config',
			graph.root.resolve('config', 'vitest.config.ts'),
			...related,
			...paths,
			...positionals.map(String),
			...(other as Array<string>),
		],
		opts: { stdio: 'inherit' },
	});
};
