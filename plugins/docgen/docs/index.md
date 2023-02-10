---
title: '@onerepo/plugin-docgen'
description: |
  Auto-generate documentation from your oneRepo CLI.
---

## Installation

```js
const { docgen } = require('@onerepo/plugin-docgen');

(async () => {
	const { run } = await setup({
		plugins: [docgen()],
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

The `docgen` command does not accept any positional arguments.

| Option            | Type                        | Description                                                                | Required |
| ----------------- | --------------------------- | -------------------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                   | Add the output file to the git stage                                       |          |
| `--bin`           | `string`                    | Path to the OneRepo cli runner. Defaults to the current runner.            |          |
| `--command`       | `string`                    | Start at the given command, skip the root and any others                   |          |
| `--format`        | `string`, default: `"json"` | Output format for documentation                                            |          |
| `--out-file`      | `string`                    | File to write output to. If not provided, stdout will be used              |          |
| `--out-workspace` | `string`                    | Workspace name to write the --out-file to                                  |          |
| `--safe-write`    | `boolean`                   | Write documentation to a portion of the file with start and end sentinels. |          |

<!-- end-onerepo-sentinel -->
