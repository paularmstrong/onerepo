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
	const files = await getModifiedFiles();

	const hasEntry = new Set<Workspace>();
	const workspaces = new Set<Workspace>();

	for (const filepath of files) {
		const fullFilepath = path.join(graph.root.resolve(filepath));
		const ws = graph.getByLocation(fullFilepath);
		if (ws.private) {
			continue;
		}

		workspaces.add(ws);
		if (fullFilepath.startsWith(ws.resolve('.changes'))) {
			hasEntry.add(ws);
		}
	}

	const missing = new Set<Workspace>();
	for (const workspace of workspaces) {
		if (!hasEntry.has(workspace)) {
			logger.error(`Workspace "${workspace.name}" is missing a required change entry.`);
			missing.add(workspace);
		}
	}

	if (logger.hasError) {
		logger.error(`\u0000\nAdd change entries to continue:\n\n  $ one change add\n\u0000`);
	}
};
