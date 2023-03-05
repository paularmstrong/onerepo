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

## Workflow

1. For every change that should be documented in a changelog, add a changeset using the `add` command. This command will walk you through itself, prompting for information for each modified workspace:

   ```sh
   one change add
   ```

   Commit any files that are added during this process. You can always go back and edit these files manually, as long as they exist.

1. When you have enough changes and you’re ready to publish, run the [version](#one-changesets-version) command.

   ```sh
   one change version
   ```

   This will also prompt you for the workspaces that you want to publish. You can restrict this to avoid publishing any workspaces that are not yet ready.

   However, any dependency in the graph of the chosen workspace(s) that has changes will also be versioned and published at this time. This is an important step to ensure consumers external to your oneRepo have all of the latest changes.

   This command will delete the consumed changesets, write changelogs, and update version numbers across all modified workspaces. Commit these changes and review them using a pull-request.

1. Once the pull-request is merged, you can safely run the [publish](#one-changesets-publish) command:

   ```sh
    one change publish
   ```

<aside>

This plugin will trigger the [core `tasks` plugin](https://onerepo.tools/docs/plugins/tasks/) `build` lifecycle for every workspace during pre-release and publish. There is no need to manually run a build before publishing.

</aside>

<!-- start-auto-generated-from-cli-changesets -->

## `one change`

Aliases: `changeset`, `changesets`

Manage changesets, versioning, and publishing your public workspaces to packages.

```sh
one change <command> [options]
```

### `one change add`

Aliases: `$0`

Add a changeset

```sh
one change add [options]
```

| Option                    | Type                            | Description                                                                                                         | Required |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--add`, `--update-index` | `boolean`, default: `true`      | Add the modified `package.json` files to the git stage for committing.                                              |          |
| `--affected`              | `boolean`                       | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                         |          |
| `--all`, `-a`             | `boolean`                       | Run across all workspaces                                                                                           |          |
| `--files`, `-f`           | `array`                         | Determine workspaces from specific files                                                                            |          |
| `--type`                  | `"major"`, `"minor"`, `"patch"` | Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type. |          |
| `--workspaces`, `-w`      | `array`                         | List of workspace names to run against                                                                              |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

### `one change init`

Initialize changesets for this repository.

```sh
one change init
```

You should only ever have to do this once.

### `one change prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

```sh
one change prerelease
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

### `one change publish`

Aliases: `release`

Publish all workspaces with versions not available in the registry.

```sh
one change publish [options]
```

This command is safe to run any time – only packages that have previously gone through the `version` process will end up being published.

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

### `one change version`

Version workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

```sh
one change version
```

| Option                    | Type                       | Description                                                            | Required |
| ------------------------- | -------------------------- | ---------------------------------------------------------------------- | -------- |
| `--add`, `--update-index` | `boolean`, default: `true` | Add the modified `package.json` files to the git stage for committing. |          |

<details>

<summary>Advanced options</summary>

| Option          | Type      | Description                                                 | Required |
| --------------- | --------- | ----------------------------------------------------------- | -------- |
| `--allow-dirty` | `boolean` | Bypass checks to ensure no local changes before publishing. |          |

</details>

<!-- end-auto-generated-from-cli-changesets -->
