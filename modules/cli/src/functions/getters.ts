import path from 'node:path';
import type { Repository, Workspace } from '@onerepo/graph';
import type { Step } from '@onerepo/logger';
import { getModifiedFiles } from './git';
import { stepWrapper } from '../logger';

type Options = {
	step?: Step;
};

export type GetterArgv = { all?: boolean; files?: Array<string>; workspaces?: Array<string>; affected?: boolean };

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

export async function getWorkspaces(
	graph: Repository,
	argv: GetterArgv,
	{ step }: Options = {}
): Promise<Array<Workspace>> {
	return stepWrapper({ step, name: 'Get workspaces from inputs' }, async (step) => {
		let workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			workspaces = Object.values(graph.workspaces);
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(`\`files\` requested: \n • ${argv.files.join('\n • ')}`);
			workspaces = graph.getAllByLocation(argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(`\`workspaces\` requested: \n • ${argv.workspaces.join('\n • ')}`);
			workspaces = graph.getAllByName(argv.workspaces);
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				step.log(`\`affected\` requested`);
				workspaces = await getAffected(graph, undefined, { step });
			} else {
				const names = workspaces.map((ws) => ws.name);
				step.log(`\`affected\` requested from • ${names.join('\n • ')}`);
				workspaces = graph.getAllByName(await graph.affected(names));
			}
		}

		return workspaces;
	});
}

export async function getFilepaths(graph: Repository, argv: GetterArgv, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Get filepaths from inputs' }, async (step) => {
		const paths: Array<string> = [];
		const workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			paths.push('.');
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(`\`files\` requested: \n • ${argv.files.join('\n • ')}`);
			paths.push(...argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(`\`workspaces\` requested: \n • ${argv.workspaces.join('\n • ')}`);
			workspaces.push(...(graph.getAllByName(argv.workspaces) ?? Object.values(graph.workspaces)));
			paths.push(...workspaces.map((workspace) => path.relative(graph.root.location, workspace.location)));
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				const files = await getModifiedFiles();
				const toCheck = [...files.added, ...files.modified];
				paths.push(...toCheck);
			} else {
				step.log('`affected` requested from workspaces');
				const affected = graph.getAllByName(await graph.affected(argv.workspaces!));
				paths.push(...affected.map((ws) => ws.location));
			}
		}

		return paths;
	});
}
