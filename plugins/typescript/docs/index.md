---
title: '@onerepo/plugin-typescript'
description: Run typescript checking across workspaces.
---

## Installation

```js
const { typescript } = require('@onerepo/plugin-typescript');

(async () => {
	const { run } = await setup({
		plugins: [typescript({ tsconfig: 'tsconfig.check.json' })],
	});

	await run();
})();
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
