import pc from 'picocolors';
import type { Graph, Workspace } from '@onerepo/graph';
import { getLogger } from '@onerepo/logger';
import inquirer from 'inquirer';
import type { getVersionable } from './get-versionable';

export async function requestVersioned(
	graph: Graph,
	versionable: Awaited<ReturnType<typeof getVersionable>>,
	message: string = 'Which workspaces should be versioned?',
) {
	const logger = getLogger();
	logger.pause();

	const data = Array.from(versionable.keys()).reduce(
		(memo, ws) => {
			if (versionable.get(ws)?.entries.length) {
				memo.changes.push(ws);
			} else if (versionable.get(ws)?.logs.length) {
				memo.logs.push(ws);
			}
			return memo;
		},
		{ changes: [] as Array<Workspace>, logs: [] as Array<Workspace> },
	);

	const { input } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'input',
			message,
			pageSize: Array.from(versionable.keys()).length,
			choices: [
				...(data.changes.length
					? [
							new inquirer.Separator(
								`\nWorkspaces with change entries:\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`,
							),
						]
					: []),
				...data.changes.map((ws) => ({ value: ws.name, name: `${ws.name} ${pc.dim(`(${ws.version})`)}` })),
				...(data.logs.length
					? [
							new inquirer.Separator(
								`\nWorkspaces modified without change entries:\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`,
							),
						]
					: []),
				...data.logs.map((ws) => ({ value: ws.name, name: `${ws.name} ${pc.dim(`(${ws.version})`)}` })),
			],
		},
	]);
	logger.unpause();
	return graph.getAllByName(input);
}
