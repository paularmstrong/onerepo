import type { Graph, GraphSchemaValidators, Workspace } from 'onerepo';

export default {
	'**': {
		'package.json': (workspace: Workspace, graph: Graph) => ({
			type: 'object',
			properties: {
				repository: {
					type: 'object',
					properties: {
						directory: { type: 'string', const: graph.root.relative(workspace.location) },
					},
					required: ['directory'],
				},
			},
			required: ['repository'],
		}),
	},
} satisfies GraphSchemaValidators;
