---
title: '@onerepo/plugin-changesets'
tool: Changesets
description: |
  Manage changelogs with changesets and publish workspaces to public packages.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-changesets
```

```js {1,5-7}
const { changesets } = require('@onerepo/plugin-changesets');

setup({
	plugins: [
		changesets({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

## Publish config

In order to properly use source-level dependencies without requiring constant file watching and rebuilding across workspaces, all `package.json` files should reference a _source_ file in its `"main"` field, eg, `"main": "./src/index.ts"`.

This causes issues when publishing shared modules for use outside of the monorepo, because consumers will likely need to use a pre-compiled version of the module. In order to safely rewrite this, as well as some other related fields, we build upon NPM’s [`publishConfig`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#publishconfig) to include other fields: `bin`, `main`, `module`, `typings`, and `exports`. The presence of any of these fields in your `publishConfig` will trigger this plugin’s commands to overwrite the initial values during the publish cycle:

<div class="grid grid-cols-2 gap-4">

```json title="source package.json"
{
	"name": "my-package",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/src/index.d.ts"
	}
}
```

```json title="published package.json"
{
	"name": "my-package",
	"main": "./dist/index.js",
	"typings": "./dist/src/index.d.ts"
}
```

</div>

## Build requirements

This plugin _requires_ a top-level command, `build` that accepts a list of workspaces using the `withWorkspaces()` builder. Your build process _must_:

1. Accept a list of workspaces to build.

```ts title="commands/build.ts"
import { withWorkspaces } from 'onerepo';
import type { Builder, Handler, WithWorkspaces } from 'onerepo';

export const command = 'build';

type Args = WithWorkspaces;

export const builder: Builder<Args> = (yargs) => withWorkspaces(yargs);

export const handler: Handler<Args> = (argv, { getWorkspaces }) => {
	const workspaces = await getWorkspaces();

	for (const workspace of workspaces) {
		// build
	}
};
```

<!-- start-onerepo-sentinel -->

## `one changesets`

Aliases: `change`

Manage changesets, versioning, and publishing your public workspaces to packages.

```sh
one changesets <command> [options]
```

### `one changesets add`

Aliases: `$0`

Add a changeset

```sh
one changesets add [options]
```

| Option               | Type                            | Description                                                                                                         | Required |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean`                       | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                         |          |
| `--all`, `-a`        | `boolean`                       | Run across all workspaces                                                                                           |          |
| `--files`, `-f`      | `array`                         | Determine workspaces from specific files                                                                            |          |
| `--type`             | `"major"`, `"minor"`, `"patch"` | Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type. |          |
| `--workspaces`, `-w` | `array`                         | List of workspace names to run against                                                                              |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

### `one changesets init`

Initialize changesets for this repository.

```sh
one changesets init
```

You should only ever have to do this once.

### `one changesets prepare`

Prepare workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

```sh
one changesets prepare
```

### `one changesets prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

```sh
one changesets prerelease
```

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |

### `one changesets publish`

Aliases: `release`

Publish all workspaces with versions not available in the registry.

```sh
one changesets publish [options]
```

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |

<details>

<summary>Advanced options</summary>

| Option          | Type      | Description                                                 | Required |
| --------------- | --------- | ----------------------------------------------------------- | -------- |
| `--allow-dirty` | `boolean` | Bypass checks to ensure no local changes before publishing. |          |

</details>

<!-- end-onerepo-sentinel -->
