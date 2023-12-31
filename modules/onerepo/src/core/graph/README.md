---
title: Graph
description: |
  Get information about your repository’s workspace graph.
usage: graph
---

# Graph

## Configuration

The `one graph verify` command comes with some basic schema for validating `package.json` files and no configuration is _required_.

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

### Options

<!-- start-usage-typedoc -->

This content will be auto-generated. Do not edit

<!-- end-usage-typedoc -->

## Usage

<!-- start-auto-generated-from-cli-graph -->

This content will be auto-generated. Do not edit

<!-- end-auto-generated-from-cli-graph -->

## Validating configurations

The Graph module in oneRepo has support for validating most configuration files in workspaces, including JSON, CJSON, YAML, and static JavaScript/TypeScript configurations.

Schema validation uses [AJV](https://ajv.js.org) with support for JSON schemas draft-2019-09 and draft-07. It also supports [ajv-errors](https://ajv.js.org/packages/ajv-errors.html) for better and more actionable error messaging.

### Example JSON validation

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

### Example JS/TS validation

Note that if the configuration is the default export, like in the case of `jest.config.js` files, you will need to validate the `default` export as a property, just like any other export.

```js title="graph-schema.ts"
import type { GraphSchemaValidators } from 'onerepo';

export default {
	'**/*': {
		'jest.config.js': {
			type: 'object',
			properties: {
				default: {
					type: 'object',
					properties: {
						displayName: { type: 'string' },
						clearMocks: { type: 'boolean', const: true },
						resetMocks: { type: 'boolean', const: true },
					},
					required: ['displayname', 'clearMocks', 'resetMocks'],
				}
			},
			required: ['default']
		},
	},
} satisfies GraphSchemaValidators;
```

### Functional schema

There are cases where more information about a workspace is needed for the schema to be complete. For this, the schema may also be a function that accepts two arguments, `workspace` and `graph`:

```ts
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
```

### Base schema

oneRepo provides a base schema with some defaults for private & public `package.json` files. If the provided schema are not to your liking, you can override with the location glob `'**'`:

```js title="graph-schema.js" {2}
module.export = {
	'**': {
		'package.json': {
			/* ... */
		},
	},
};
```

## Extensions

### Required files

To mark a file as required, the JSON schema validation has been extended to include a key `$required` at the top level of each file schema. Setting this key to `true` will result in errors if a matched workspace does not include this file:

```ts {7} /$required/
import type { graph, GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'package.json': {
			type: 'object',
			$required: true,
		},
	},
} satisfies GraphSchemaValidators;
```

## Disabling

Warning: disabling the graph will disable all the `graph`-specifc commands as well as all workspace-specific commands. While this is allowed, it is _not_ recommended.

```js {3,4} /false/
setup({
	core: {
		// Disable the graph entirely from your CLI
		graph: false,
	},
}).then({ run } => run());
```
