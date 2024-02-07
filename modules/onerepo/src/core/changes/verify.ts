import path from 'node:path';
import { getModifiedFiles } from '@onerepo/git';
import type { Workspace } from '@onerepo/graph';
import type { Builder, Handler } from '@onerepo/yargs';

export const command = ['verify', 'required'];

export const description = 'Ensure there are change entries for every modified public Workspace.';

export const builder: Builder = (yargs) =>
	yargs
		.usage(`$0 ${command[0]}`)
		.epilogue(
			'Add this to your pre-commit or pre-merge task lifecycles to ensure that changes to public & publishabled Workspaces are always accompanied with change entries.',
		);

export const handler: Handler = async (argv, { graph, logger }) => {
	const step = logger.createStep('Verify required change entries');
	const files = await getModifiedFiles(undefined, { step });

	const hasEntry = new Set<Workspace>();
	const workspaces = new Set<Workspace>();
	const filesByWorkspace = new Map<Workspace, Array<string>>(graph.workspaces.map((ws) => [ws, [] as Array<string>]));

	for (const filepath of files) {
		const fullFilepath = path.join(graph.root.resolve(filepath));
		const ws = graph.getByLocation(fullFilepath);
		const files = filesByWorkspace.get(ws)!;
		files.push(fullFilepath);
	}

	for (const ws of filesByWorkspace.keys()) {
		const files = filesByWorkspace.get(ws)!;
		if (ws.private || files.length === 0) {
			continue;
		}

		const hasPackageJson = files.some((fp) => fp === ws.resolve('package.json'));
		const hasChangelog = files.some((fp) => fp === ws.resolve('CHANGELOG.md'));

		if ((files.length === 2 && hasPackageJson && hasChangelog) || (files.length === 1 && hasChangelog)) {
			continue;
		}

		workspaces.add(ws);
		if (files.some((fp) => fp.startsWith(ws.resolve('.changes')))) {
			hasEntry.add(ws);
		}
	}

	const missing = new Set<Workspace>();
	for (const workspace of workspaces) {
		if (!hasEntry.has(workspace)) {
			step.error(`Workspace "${workspace.name}" is missing a required change entry.`);
			missing.add(workspace);
		}
	}

	if (step.hasError) {
		step.error(`\u0000\nAdd change entries to continue:\n\n  $ one change add\n\u0000`);
	}

	await step.end();
};
