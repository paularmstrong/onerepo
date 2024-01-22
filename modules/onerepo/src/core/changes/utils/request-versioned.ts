import pc from 'picocolors';
import type { Graph } from '@onerepo/graph';
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
	const { input } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'input',
			message,
			pageSize: Array.from(versionable.all.keys()).length,
			choices: [
				...(versionable.hasLogs.length
					? [
							new inquirer.Separator(
								`\nWorkspaces with change entries:\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`,
							),
						]
					: []),
				...versionable.hasChangesets.map((ws) => ({ value: ws.name, name: `${ws.name} ${pc.dim(`(${ws.version})`)}` })),
				...(versionable.hasLogs.length
					? [
							new inquirer.Separator(
								`\nWorkspaces modified without change entries:\n${'⎯'.repeat(Math.min(60, process.stdout.columns))}`,
							),
						]
					: []),
				...versionable.hasLogs.map((ws) => ({ value: ws.name, name: `${ws.name} ${pc.dim(`(${ws.version})`)}` })),
			],
		},
	]);
	logger.unpause();
	return graph.getAllByName(input);
}
