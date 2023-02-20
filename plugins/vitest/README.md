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
one vitest test [file-patterns] [options]
one vitest [options]
```

This command also accepts any argument that [vitest accepts](https://vitest.dev/guide/cli.html) and passes them through.

| Positional      | Type    | Description                                                    | Required |
| --------------- | ------- | -------------------------------------------------------------- | -------- |
| `file-patterns` | `array` | Any set of valid test file patterns to pass directly to vitest |          |

| Option                 | Type      | Description                                         | Required |
| ---------------------- | --------- | --------------------------------------------------- | -------- |
| `--affected`           | `boolean` | Run tests related to all affected workspaces        |          |
| `--all`, `-a`          | `boolean` | Lint all files unconditionally                      |          |
| `--inspect`            | `boolean` | Break for the the Node inspector to debug tests     |          |
| `--workspaces`, `--ws` | `array`   | List of workspace names to restrict linting against |          |

Run vitest in --watch mode.

```sh
one vitest test --watch
```

<!-- end-onerepo-sentinel -->
