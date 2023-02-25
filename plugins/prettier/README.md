---
title: '@onerepo/plugin-prettier'
tool: Prettier
description: |
  Format files as they change using Prettier.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-prettier
```

```js {1,5-7}
const { prettier } = require('@onerepo/plugin-prettier');

setup({
	plugins: [
		prettier({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

<!-- start-auto-generated-from-cli-prettier -->

## `one prettier`

Format files with prettier

```sh
one prettier [options]
```

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean` | Add modified files after write                                                              |          |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--check`            | `boolean` | Check for changes.                                                                          |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                    |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

<!-- end-auto-generated-from-cli-prettier -->
