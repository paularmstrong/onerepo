---
title: '@onerepo/plugin-vitest'
description: |
  Run Vitest tests across your repository.
---

## Installation

```js
const { vitest } = require('@onerepo/plugin-vitest');

(async () => {
	const { run } = await setup({
		plugins: [vitest()],
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one vitest`

Run unit tests

```sh
one vitest test [file-patterns] [options]
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
$0 test --watch
```

<!-- end-onerepo-sentinel -->
