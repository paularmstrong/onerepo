---
title: '@onerepo/plugin-eslint'
description: |
  Add easy and fast linting with Eslint to your repo through one simple plugin.
---

## Installation

```js
const { eslint } = require('@onerepo/plugin-eslint');

(async () => {
	const { run } = await setup({
		plugins: [eslint()],
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one eslint`

Lint files using eslint

```sh
one eslint [options]
```

The `eslint` command does not accept any positional arguments.

| Option               | Type                                   | Description                                                                                 | Required |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`                              | Add modified files after write                                                              |          |
| `--affected`         | `boolean`                              | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                              | Run across all workspaces                                                                   |          |
| `--cache`            | `boolean`, default: `true`             | Use cache if available                                                                      |          |
| `--extensions`       | `array`, default: `["js","cjs","mjs"]` |                                                                                             |          |
| `--files`, `-f`      | `array`                                | Determine workspaces from specific files                                                    |          |
| `--fix`              | `boolean`, default: `true`             | Apply auto-fixes if possible                                                                |          |
| `--from-ref`         | `string`                               | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`                               | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`                                | List of workspace names to run against                                                      |          |

<!-- end-onerepo-sentinel -->
