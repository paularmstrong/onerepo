---
title: '@onerepo/plugin-vitest'
tool: Vitest
description: |
  Run Vitest tests across your repository.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-vitest
```

```js {1,5-7}
const { vitest } = require('@onerepo/plugin-vitest');

setup({
	plugins: [
		vitest({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

<!-- start-onerepo-sentinel -->

## `one vitest`

Run unit tests using Vitest

```sh
one vitest [options] -- [passthrough]
one vitest [options]
```

This test commad will automatically attempt to run only the test files related to the changes in your git branch. By passing specific filepaths as extra passthrough arguments after two dashes (`--`), you can further restrict the tests to those specific files only.

Additionally, any other [Vitest CLI options](https://vitest.dev/guide/cli.html) can be passed as passthrough arguments as well.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--inspect`          | `boolean` | Break for the the Node inspector to debug tests.                                            |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                      | Description                                                | Required |
| --------------- | ----------------------------------------- | ---------------------------------------------------------- | -------- |
| `--config`      | `string`, default: `"./vitest.config.ts"` | Path to the vitest.config file, relative to the repo root. |          |
| `--from-ref`    | `string`                                  | Git ref to start looking for affected files or workspaces  |          |
| `--through-ref` | `string`                                  | Git ref to start looking for affected files or workspaces  |          |

</details>

Run only tests related to modified files.

```sh
one vitest
```

Run vitest in --watch mode.

```sh
one vitest -- --watch
```

Run vitest in watch mode with a particular file.

```sh
one vitest -- -w path/to/test.ts
```

<!-- end-onerepo-sentinel -->
