---
title: '@onerepo/plugin-graph'
description: |
  Get information about your repository’s workspace graph.
type: core
---

## Installation

This is a core plugin that does not need to be installed manually.

## Configuration

The `one graph verify` command comes with some basic schema for validating `package.json` files. However, you can enhance this by providing custom schema to match to workspaces and their files:

```js
(async () => {
	const { run } = await setup({
		core: {
			graph: {
				customSchema: './path/to/graph-schema.js',
			},
		},
	});

	await run();
})();
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

## Uninstall

Warning: disabling the graph will disable both the `graph`-specifc commands as well as all workspace-specific commands.

```js
(async () => {
	const { run } = await setup({
		core: {
			// Disable the graph entirely from your CLI
			graph: false,
		},
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one graph`

Run core graph commands

```sh
one graph <command>
```

### `one graph show`

Show the dependency graph.

```sh
one graph show [options]
```

| Option     | Type                         | Description                                       | Required |
| ---------- | ---------------------------- | ------------------------------------------------- | -------- |
| `--format` | `string`, default: `"plain"` | Output format for inspecting the dependency graph |          |

### `one graph verify`

Verify the integrity of the repo’s dependency graph.

```sh
one graph verify
```

<details>

<summary>Advanced options</summary>

| Option            | Type     | Description                        | Required |
| ----------------- | -------- | ---------------------------------- | -------- |
| `--custom-schema` | `string` | Path to a custom schema definition |          |

</details>

<!-- end-onerepo-sentinel -->
