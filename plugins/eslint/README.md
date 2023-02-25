---
title: '@onerepo/plugin-eslint'
tool: Eslint
description: |
  Add easy and fast linting with Eslint to your repo through one simple plugin.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-eslint
```

```js {1,5-7}
const { eslint } = require('@onerepo/plugin-eslint');

setup({
	plugins: [
		eslint({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

<!-- start-auto-generated-from-cli-eslint -->

## `one eslint`

Run eslint across files and workspaces

```sh
one eslint [options]
```

| Option               | Type                                   | Description                                                                                 | Required |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`                              | Add modified files after write                                                              |          |
| `--affected`         | `boolean`                              | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                              | Run across all workspaces                                                                   |          |
| `--cache`            | `boolean`, default: `true`             | Use cache if available                                                                      |          |
| `--extensions`       | `array`, default: `["js","cjs","mjs"]` |                                                                                             |          |
| `--files`, `-f`      | `array`                                | Determine workspaces from specific files                                                    |          |
| `--fix`              | `boolean`, default: `true`             | Apply auto-fixes if possible                                                                |          |
| `--workspaces`, `-w` | `array`                                | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

<!-- end-auto-generated-from-cli-eslint -->
