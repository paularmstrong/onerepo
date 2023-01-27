import path from 'node:path';
import type { Builder, Handler } from '@onerepo/cli';
import { git, run } from '@onerepo/cli';

export const command = 'eslint';

export const description = 'Lint files using eslint';

type Args = {
	add?: boolean;
	all?: boolean;
	cache: boolean;
	files?: Array<string>;
	fix?: boolean;
	workspaces?: Array<string>;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write',
			conflicts: ['all'],
		})
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Lint all files unconditionally',
		})
		.option('cache', {
			type: 'boolean',
			default: true,
			description: 'Use cache if available',
		})
		.option('files', {
			alias: 'f',
			type: 'array',
			string: true,
			description: 'Lint specific files',
			conflicts: ['all', 'workspaces'],
		})
		.option('fix', {
			type: 'boolean',
			default: true,
			description: 'Apply auto-fixes if possible',
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of workspace names to restrict linting against',
			conflicts: ['all', 'files'],
		});

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { add, all, cache, 'dry-run': isDry, files, fix, workspaces: workspaceNames } = argv;

	const paths: Array<string> = [];
	if (all) {
		paths.push('.');
	} else if (files) {
		paths.push(...files.filter((file) => extensions.includes(path.extname(file).replace(/^\./, ''))));
	} else if (workspaceNames) {
		const workspaces = graph.getAllByName(workspaceNames) ?? Object.values(graph.workspaces);
		paths.push(...workspaces.map((workspace) => path.relative(graph.root.location, workspace.location)));
	} else {
		const files = await git.getModifiedFiles();
		const toCheck = [...files.added, ...files.modified].filter((file) =>
			extensions.includes(path.extname(file).replace(/^\./, ''))
		);
		paths.push(...toCheck);
	}

	await run({
		name: `Lint ${all ? '' : paths.join(', ').substring(0, 40)}…`,
		cmd: 'npx',
		args: ['eslint', '--ext', extensions.join(','), cache ? '--cache' : '', !isDry && fix ? '--fix' : '', ...paths],
	});

	if (add) {
		await git.updateIndex(paths);
	}
};

const extensions = ['ts', 'tsx', 'js', 'jsx', 'cjs', 'mjs'];
