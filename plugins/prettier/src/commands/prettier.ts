import path from 'node:path';
import type { Builder, Handler } from '@onerepo/cli';
import { git, run } from '@onerepo/cli';

export const command = 'prettier';

export const description = 'Format files with prettier';

type Args = {
	add?: boolean;
	all?: boolean;
	check?: boolean;
	files?: Array<string>;
	workspaces?: Array<string>;
};

export const builder: Builder<Args> = (yargs) =>
	yargs
		.option('add', {
			type: 'boolean',
			description: 'Add modified files after write',
			conflicts: ['all', 'check'],
		})
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Format all files unconditionally',
		})
		.option('check', {
			description: 'Check for changes.',
			type: 'boolean',
		})
		.option('files', {
			alias: 'f',
			type: 'array',
			string: true,
			description: 'Format specific files',
			conflicts: ['all', 'workspaces'],
		})
		.option('workspaces', {
			alias: 'w',
			type: 'array',
			string: true,
			description: 'List of workspace names to restrict formatting against',
			conflicts: ['all', 'files'],
		});

export const handler: Handler<Args> = async function handler(argv, { graph }) {
	const { add, all, check, 'dry-run': isDry, files, workspaces: workspaceNames } = argv;

	const paths: Array<string> = [];
	if (all) {
		paths.push('.');
	} else if (files) {
		paths.push(...files);
	} else if (workspaceNames) {
		const workspaces = graph.getAllByName(workspaceNames) ?? Object.values(graph.workspaces);
		paths.push(...workspaces.map((workspace) => path.relative(graph.root.location, workspace.location)));
	} else {
		const files = await git.getModifiedFiles();
		const toCheck = [...files.added, ...files.modified];
		paths.push(...toCheck);
	}

	await run({
		name: `Format files ${all ? '' : paths.join(', ').substring(0, 60)}…`,
		cmd: 'npx',
		args: ['prettier', '--ignore-unknown', isDry || check ? '--list-different' : '--write', ...paths],
	});

	if (add) {
		await git.updateIndex(paths);
	}
};
