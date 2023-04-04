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

### Options

<!-- start-usage-typedoc -->

This content will be auto-generated. Do not edit

<!-- end-usage-typedoc -->

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
			require: ['default']
		},
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

## Disabling

Warning: disabling the graph will disable all the `graph`-specifc commands as well as all workspace-specific commands. While this is allowed, it is _not_ recommended.

```js {3,4}
setup({
	core: {
		// Disable the graph entirely from your CLI
		graph: false,
	},
}).then({ run } => run());
```

## Usage

<!-- start-auto-generated-from-cli-graph -->

This content will be auto-generated. Do not edit

<!-- end-auto-generated-from-cli-graph -->
