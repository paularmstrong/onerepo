---
title: '@onerepo/plugin-docgen'
tool: DocGen
description: |
  Auto-generate documentation from your oneRepo CLI.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-docgen
```

```js {1,5-7}
const { docgen } = require('@onerepo/plugin-docgen');

setup({
	plugins: [
		docgen({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

<!-- start-onerepo-sentinel -->

## `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

| Option            | Type                        | Description                                                                | Required |
| ----------------- | --------------------------- | -------------------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                   | Add the output file to the git stage                                       |          |
| `--bin`           | `string`                    | Path to the OneRepo cli runner. Defaults to the current runner.            |          |
| `--format`        | `string`, default: `"json"` | Output format for documentation                                            |          |
| `--out-file`      | `string`                    | File to write output to. If not provided, stdout will be used              |          |
| `--out-workspace` | `string`                    | Workspace name to write the --out-file to                                  |          |
| `--safe-write`    | `boolean`                   | Write documentation to a portion of the file with start and end sentinels. |          |

<details>

<summary>Advanced options</summary>

| Option      | Type     | Description                                              | Required |
| ----------- | -------- | -------------------------------------------------------- | -------- |
| `--command` | `string` | Start at the given command, skip the root and any others |          |

</details>

<!-- end-onerepo-sentinel -->
