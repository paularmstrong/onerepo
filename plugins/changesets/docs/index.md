---
title: '@onerepo/plugin-changesets'
description: |
  Create changesets and prepare releases for your workspaces.
---

## Installation

```
npm install --save-dev @onerepo/plugin-changesets
```

```js
const { changesets } = require('@onerepo/plugin-changesets');

(async () => {
	const { run } = await setup({
		plugins: [changesets()],
	});

	await run();
})();
```

## Build requirements

This plugin _requires_ a top-level command, `build` that accepts a list of workspaces using the `withWorkspaces()` builder. Your build process _must_:

1. Build files to each workspace’s `dist` directory
1. Copy the `package.json` into the `dist` directory (eg `cp module/tacos/package.json modules/tacos/dist/package.json`)
1. Update fields in the `dist/package.json` with the correct paths (eg `main`, `module`, `bin`, and `typings`).

```ts title="commands/build.ts"
import { withWorkspaces } from 'onerepo';
import type { Builder, Handler, WithWorkspaces } from 'onerepo';

export const command = 'build';

type Args = WithWorkspaces;

export const builder: Builder<Args> = (yargs) => withWorkspaces(yargs);

export const handler: Handler<Args> = (argv, { getWorkspaces }) => {
	const workspaces = await getWorkspaces();

	for (const workspace of workspaces) {
		// build, copy, and update
	}
};
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
