import type { Repository } from '@onerepo/graph';
import { getModifiedFiles } from './git';
import { stepWrapper } from '../logger';
import type { Step } from '@onerepo/logger';

type Options = {
	step?: Step;
};

export function getAffected(graph: Repository, since?: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Get affected workspaces' }, async (step) => {
		const { all } = await getModifiedFiles(since, { step });
		const workspaces = new Set<string>();
		for (const filepath of all) {
			const ws = graph.getByLocation(graph.root.resolve(filepath));
			if (ws) {
				step.debug(`Found changes within \`${ws.name}\``);
				workspaces.add(ws.name);
			}
		}

		return graph.affected(Array.from(workspaces)).map((name) => graph.getByName(name)!);
	});
}
