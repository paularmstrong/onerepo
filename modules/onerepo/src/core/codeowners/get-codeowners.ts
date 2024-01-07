import type { Graph, Workspace } from '@onerepo/graph';

export function getCodeowners(graph: Graph) {
	return graph.workspaces
		.map((ws: Workspace) => {
			if (!Object.keys(ws.codeowners).length) {
				return '';
			}

			return `# ${ws.name}
${Object.entries(ws.codeowners)
	.map(
		([matchPath, owners]) =>
			`${graph.root.relative(ws.resolve(matchPath.replace(/(\s+)/g, '\\$1')))}    ${owners.join(' ')}`,
	)
	.join('\n')}

`;
		})
		.join('');
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
