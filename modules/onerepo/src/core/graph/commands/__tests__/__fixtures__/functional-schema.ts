import type { graph, GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'package.json': (workspace: graph.Workspace, graph: graph.Graph) => ({
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
