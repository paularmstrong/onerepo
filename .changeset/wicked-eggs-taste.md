---
'@onerepo/core': minor
'onerepo': minor
---

Allows custom schema validators for `graph verify` to be functions that return JSONSchema.

As a function, the schema accepts two arguments, `workspace` and `graph`:

```ts
import type { graph } from 'onerepo';

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
};
```
