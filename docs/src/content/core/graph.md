---
title: Graph
description: |
  Get information about your repository’s workspace graph.
usage: graph
---

# Graph

## Configuration

The `one graph verify` command comes with some basic schema for validating `package.json` files and no configuration is _require_.

However, you can enhance this by providing custom schema to match to workspaces and their files:

```js {3-5}
setup({
	core: {
		graph: {
			customSchema: './path/to/graph-schema.js',
		},
	},
}).then(({ run }) => run());
```

Schema validation uses [AJV](https://ajv.js.org) with support for JSON schemas draft-2019-09 and draft-07. It also supports [ajv-errors](https://ajv.js.org/packages/ajv-errors.html) for better and more actionable error messaging.

```js title="graph-schema.js"
module.exports = {
	'modules/*': {
		'package.json': {
			type: 'object',
			properties: {
				// Ensure package names start with your organizations scope:
				name: {
					type: 'string',
					pattern: '^@scope\\/',
					// ajv-errors addition
					errorMessage: {
						pattern: 'Modules must be scoped for the organization, "@scope/<name>"',
					},
				},
			},
			required: ['name'],
		},
	},
	'apps/*': {
		'tsconfig.json': {
			type: 'object',
			properties: {
				// Ensure your tsconfig.json extends your standard config
				extends: { type: 'string', enum: ['@scope/tsconfig/base.json'] },
			},
		},
	},
};
```

<aside aria-labelled-by="#validation-title">

<p id="validation-title"><b>Overriding the base schema</b></p>

To override the base schema, use the location glob `'**'`:

```js title="graph-schema.js"
module.export = {
	'**': {
		'package.json': {
			/* ... */
		},
	},
};
```

</aside>

## Disabling

Warning: disabling the graph will disable both the `graph`-specifc commands as well as all workspace-specific commands.

```js
setup({
	core: {
		// Disable the graph entirely from your CLI
		graph: false,
	},
}).then({ run } => run());
```
