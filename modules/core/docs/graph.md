---
title: Graph
description: |
  Get information about your repository’s workspace graph.
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

## Usage

<!-- start-auto-generated-from-cli-graph -->

### `one graph`

Run core graph commands

```sh
one graph <command>
```

#### `one graph show`

Show the dependency graph.

```sh
one graph show [options]
```

This command can generate representations of your workspace graph for use in debugging, verifying, and documentation.

| Option               | Type                                                 | Description                                                                                 | Required |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean`                                            | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                                            | Run across all workspaces                                                                   |          |
| `--format`           | `"mermaid"`, `"plain"`, `"json"`, default: `"plain"` | Output format for inspecting the dependency graph                                           |          |
| `--workspaces`, `-w` | `array`                                              | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

Generate a mermaid graph to a file, isolating just the given `<workspace>` and those that are dependent on it.

```sh
one graph show --format=mermaid -w <workspace> > ./out.mermaid
```

#### `one graph verify`

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

<!-- end-auto-generated-from-cli-graph -->

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
