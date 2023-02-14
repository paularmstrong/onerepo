---
title: '@onerepo/plugin-changesets'
description: |
  Create changesets and prepare releases for your workspaces.
---

## Installation

```js
const { changesets } = require('@onerepo/plugin-changesets');

(async () => {
	const { run } = await setup({
		plugins: [changesets()],
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one changesets`

Aliases: `change`

Manage changesets

```sh
one changesets <command> [options]
```

### `one changesets add`

Aliases: `$0`

Add a changeset

```sh
one changesets add [options]
```

| Option               | Type      | Description                                                                                                         | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                         |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                                           |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                                            |          |
| `--type`             | `string`  | Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type. |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                                              |          |

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

<!-- end-onerepo-sentinel -->
