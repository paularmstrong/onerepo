---
title: '@onerepo/plugin-typescript'
tool: TypeScript
description: Run typescript checking across workspaces.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-typescript
```

```js {1,5-8}
const { typescript } = require('@onerepo/plugin-typescript');

setup({
	plugins: [
		typescript({
			// The name of the tsconfig files that should be used when checking
			tsconfig: 'tsconfig.check.json',
		}),
	],
}).then(({ run }) => run());
```

<!-- start-onerepo-sentinel -->

## `one tsc`

Aliases: `typescript`, `typecheck`

Run typescript checking across workspaces

```sh
one tsc [options]
```

Checks for the existence of `tsconfig.json` file and batches running `tsc --noEmit` in each workspace.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                 | Description                                               | Required |
| --------------- | ------------------------------------ | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                             | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string`                             | Git ref to start looking for affected files or workspaces |          |
| `--tsconfig`    | `string`, default: `"tsconfig.json"` | The filename of the tsconfig to find in each workspace.   |          |

</details>

<!-- end-onerepo-sentinel -->
