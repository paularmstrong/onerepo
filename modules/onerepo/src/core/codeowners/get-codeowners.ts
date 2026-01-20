import type { Graph } from '@onerepo/graph';

export function getCodeowners(graph: Graph) {
	const result: Record<string, Array<string>> = {};
	for (const ws of graph.workspaces) {
		for (const [matchPath, owners] of Object.entries(ws.codeowners)) {
			const relativePath = graph.root.relative(ws.resolve(matchPath.replace(/(\s+)/g, '\\$1'))).trim();
			if (!(relativePath in result)) {
				result[relativePath] = [];
			}
			result[relativePath]?.push(...owners);
		}
	}

	return result;
}

export function getCodeownersContents(graph: Graph) {
	let contents = '';
	for (const ws of graph.workspaces) {
		if (!Object.keys(ws.codeowners).length) {
			continue;
		}

		contents += `# ${ws.name}\n`;

		for (const [matchPath, owners] of Object.entries(ws.codeowners)) {
			contents += `${graph.root.relative(ws.resolve(matchPath.replace(/(\s+)/g, '\\$1')))}    ${owners.join(' ')}\n`;
		}

		contents += '\n';
	}

	return contents;
}

export function codeownersFilepath(graph: Graph, provider: Providers) {
	return graph.root.resolve(location[provider]);
}

export type Providers = 'github' | 'gitlab' | 'gitea' | 'bitbucket';

export const providers: Array<Providers> = ['github', 'gitlab', 'gitea', 'bitbucket'];

export const location: Record<Providers, string> = {
	github: '.github/CODEOWNERS',
	gitlab: '.gitlab/CODEOWNERS',
	gitea: '.gitea/CODEOWNERS',
	bitbucket: 'CODEOWNERS',
};
