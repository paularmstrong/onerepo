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

The `changesets` command does not accept any positional arguments.

The `changesets` command does not accept any option arguments.

### `one changesets add`

Aliases: `$0`

Add a changeset

The `add` command does not accept any positional arguments.

| Option               | Type      | Description                                                                                                         | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                         |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                                           |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                                            |          |
| `--from-ref`         | `string`  | Git ref to start looking for affected files or workspaces                                                           |          |
| `--through-ref`      | `string`  | Git ref to start looking for affected files or workspaces                                                           |          |
| `--type`             | `string`  | Provide a semantic version bump type. If not given, a prompt will guide you through selecting the appropriate type. |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                                              |          |

### `one changesets init`

Initialize changesets for this repository.

You should only ever have to do this once.

The `init` command does not accept any positional arguments.

The `init` command does not accept any option arguments.

### `one changesets prepare`

Prepare workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

The `prepare` command does not accept any positional arguments.

The `prepare` command does not accept any option arguments.

### `one changesets prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

The `prerelease` command does not accept any positional arguments.

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |

<!-- end-onerepo-sentinel -->
