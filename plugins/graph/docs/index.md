---
title: '@onerepo/plugin-graph'
description: |
  Get information about your repository’s workspace graph.
type: core
---

## Installation

This is a core plugin that does not need to be installed manually.

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

<!-- end-onerepo-sentinel -->
