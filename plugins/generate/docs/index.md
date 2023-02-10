---
title: '@onerepo/plugin-generate'
description: |
  Generate workspaces from your own standard templates.
---

## Installation

```js
const { generate } = require('@onerepo/plugin-generate');

(async () => {
	const { run } = await setup({
		plugins: [generate()],
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one generate`

Aliases: `gen`

Generate workspaces from standard templates

```sh
one generate,gen [options]
```

The `generate` command does not accept any positional arguments.

| Option            | Type     | Description                       | Required |
| ----------------- | -------- | --------------------------------- | -------- |
| `--name`          | `string` | Name of the workspace to generate | ✅       |
| `--type`, `-t`    | `string` | Template type to generate         | ✅       |
| `--templates-dir` | `string` | Path to the templates             |          |

<!-- end-onerepo-sentinel -->
