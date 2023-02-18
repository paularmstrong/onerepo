---
layout: '../../../layouts/Docs.astro'
title: oneRepo internal CLI
description: oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage for the local CLI auto-generated docs using the docgen plugin.
---

# Internal CLI

oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage documentation for the local CLI – all auto-generated docs using the [docgen plugin](/docs/plugins/docgen/).

<!-- start-onerepo-sentinel -->

## `one`

```sh
one <command> [options]
```

| Option              | Type                  | Description                                                                   | Required |
| ------------------- | --------------------- | ----------------------------------------------------------------------------- | -------- |
| `--dry-run`         | `boolean`             | Run without actually making modifications or destructive operations           |          |
| `--show-advanced`   | `boolean`             | Show advanced options                                                         |          |
| `--verbosity`, `-v` | `count`, default: `2` | Set the verbosity of the script output. Use -v, -vv, or -vvv for more verbose |          |

<details>

<summary>Advanced options</summary>

| Option         | Type      | Description                                                          | Required |
| -------------- | --------- | -------------------------------------------------------------------- | -------- |
| `--ci`         | `boolean` | Sets defaults for running scripts in a CI environment                |          |
| `--help`, `-h` | `boolean` | Show this help screen                                                |          |
| `--silent`     | `boolean` | Silence all output from the logger. Effectively sets verbosity to 0. |          |

</details>

### `one build`

Build public workspaces using esbuild.

```sh
one build [options]
```

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

Build all workspaces.

```sh
one build
```

Build the `graph` workspace only.

```sh
one build -w graph
```

Build the `graph`, `cli`, and `logger` workspaces.

```sh
one build -w graph cli logger
```

### `one changesets`

Aliases: `change`

Manage changesets

```sh
one changesets <command> [options]
```

#### `one changesets add`

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

#### `one changesets init`

Initialize changesets for this repository.

```sh
one changesets init
```

You should only ever have to do this once.

#### `one changesets prepare`

Prepare workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

```sh
one changesets prepare
```

#### `one changesets prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

```sh
one changesets prerelease
```

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |

#### `one changesets publish`

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

### `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

| Option            | Type                                                           | Description                                                                | Required |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                                                      | Add the output file to the git stage                                       |          |
| `--bin`           | `string`                                                       | Path to the OneRepo cli runner. Defaults to the current runner.            |          |
| `--format`        | `string`, default: `"markdown"`                                | Output format for documentation                                            |          |
| `--out-file`      | `string`, default: `"docs/src/pages/docs/contributing/cli.md"` | File to write output to. If not provided, stdout will be used              |          |
| `--out-workspace` | `string`, default: `"root"`                                    | Workspace name to write the --out-file to                                  |          |
| `--safe-write`    | `boolean`, default: `true`                                     | Write documentation to a portion of the file with start and end sentinels. |          |

<details>

<summary>Advanced options</summary>

| Option      | Type     | Description                                              | Required |
| ----------- | -------- | -------------------------------------------------------- | -------- |
| `--command` | `string` | Start at the given command, skip the root and any others |          |

</details>

### `one docgen-internal`

Generate docs for the oneRepo monorepo

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean` | Add all generated files to the git stage                                                    |          |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                    |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

### `one format`

Format files with prettier

```sh
one format [options]
```

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean` | Add modified files after write                                                              |          |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--check`            | `boolean` | Check for changes.                                                                          |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                    |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

### `one generate`

Aliases: `gen`

Generate workspaces from template directories.

```sh
one generate [options]
```

To create new templates add a new folder to config/templates and create a `.onegen.cjs` configuration file. Follow the instructions online for more: https\://onerepo.tools/docs/plugins/generate/

| Option         | Type     | Description                                                                                  | Required |
| -------------- | -------- | -------------------------------------------------------------------------------------------- | -------- |
| `--name`       | `string` | Name of the workspace to generate. If not provided, you will be prompted to enter one later. |          |
| `--type`, `-t` | `string` | Template type to generate. If not provided, a list will be provided to choose from.          |          |

<details>

<summary>Advanced options</summary>

| Option            | Type                                    | Description           | Required |
| ----------------- | --------------------------------------- | --------------------- | -------- |
| `--templates-dir` | `string`, default: `"config/templates"` | Path to the templates | ✅       |

</details>

### `one graph`

Run core graph commands

```sh
one graph <command>
```

#### `one graph show`

Show the dependency graph.

```sh
one graph show [options]
```

| Option     | Type                         | Description                                       | Required |
| ---------- | ---------------------------- | ------------------------------------------------- | -------- |
| `--format` | `string`, default: `"plain"` | Output format for inspecting the dependency graph |          |

#### `one graph verify`

Verify the integrity of the repo’s dependency graph.

```sh
one graph verify
```

<details>

<summary>Advanced options</summary>

| Option            | Type     | Description                        | Required |
| ----------------- | -------- | ---------------------------------- | -------- |
| `--custom-schema` | `string` | Path to a custom schema definition |          |

</details>

### `one install`

Install the oneRepo CLI into your environment.

```sh
one install [options]
```

`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.

As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).

| Option       | Type                       | Description                                                                                                         | Required |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--force`    | `boolean`                  | Force installation regardless of pre-existing command.                                                              |          |
| `--location` | `string`                   | Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type. |          |
| `--name`     | `string`, default: `"one"` | Name of the command to install                                                                                      | ✅       |

### `one lint`

Lint files using eslint

```sh
one lint [options]
```

| Option               | Type                                                            | Description                                                                                 | Required |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`                                                       | Add modified files after write                                                              |          |
| `--affected`         | `boolean`                                                       | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                                                       | Run across all workspaces                                                                   |          |
| `--cache`            | `boolean`, default: `true`                                      | Use cache if available                                                                      |          |
| `--extensions`       | `array`, default: `["ts","tsx","js","jsx","cjs","mjs","astro"]` |                                                                                             |          |
| `--files`, `-f`      | `array`                                                         | Determine workspaces from specific files                                                    |          |
| `--fix`              | `boolean`, default: `true`                                      | Apply auto-fixes if possible                                                                |          |
| `--workspaces`, `-w` | `array`                                                         | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

### `one tasks`

Run tasks against repo-defined lifecycles. This command will limit the tasks across the affected workspace set based on the current state of the repository.

```sh
one tasks --lifecycle=<lifecycle> [options]
```

You can fine-tune the determination of affected workspaces by providing a `--from-ref` and/or `through-ref`. For more information, get help with `--help --show-advanced`.

| Option               | Type      | Description                                                                                                 | Required |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                 |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                                   |          |
| `--lifecycle`, `-c`  | `string`  | Task lifecycle to run. `pre-` and `post-` lifecycles will automatically be run for non-prefixed lifecycles. | ✅       |
| `--list`             | `boolean` | List found tasks. Implies dry run and will not actually run any tasks.                                      |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                                                                   | Description                                                               | Required |
| --------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                                                                               | Git ref to start looking for affected files or workspaces                 |          |
| `--ignore`      | `array`, default: `["yarn.lock","package-lock.json","pnpm-lock.yaml",".changesets/*"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--through-ref` | `string`                                                                               | Git ref to start looking for affected files or workspaces                 |          |

</details>

### `one test`

Run unit tests

```sh
one test [file-patterns] [options]
one test [options]
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
one test --watch
```

### `one tsc`

Aliases: `typescript`, `typecheck`

Run typescript checking across workspaces

```sh
one tsc [options]
```

Checks for the existence of `tsconfig.json` file and batches running `tsc --noEmit` in each workspace.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                 | Description                                               | Required |
| --------------- | ------------------------------------ | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                             | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string`                             | Git ref to start looking for affected files or workspaces |          |
| `--tsconfig`    | `string`, default: `"tsconfig.json"` | The filename of the tsconfig to find in each workspace.   |          |

</details>

### `one workspace`

Aliases: `$0`, `ws`

Run workspace-specific commands

```sh
one workspace <name> <command> [options]
```

Add commands to the `commands` directory within a workspace to create workspace-specific commands.

| Positional | Type     | Description                                                                     | Required |
| ---------- | -------- | ------------------------------------------------------------------------------- | -------- |
| `command`  | `string` | Workspace-specific command.                                                     |          |
| `name`     | `string` | Workspace name – may be the fully qualified package name or an available alias. |          |

Using alias `ws` instead of the full command `workspace`

```sh
one workspace myapp start [options]
```

The `workspace` command can be completely ommitted and the workspace name can be used as a top-level command instead. This make things quick and easy to remember.

```sh
$0 myapp start
```

#### `one workspace @onerepo/docs`

Aliases: `docs`

Runs commands in the `@onerepo/docs` workspace

##### `one workspace @onerepo/docs astro`

Run astro commands.

```sh
one workspace @onerepo/docs astro
```

##### `one workspace @onerepo/docs start`

Start the docs development server

```sh
one workspace @onerepo/docs start
```

<!-- end-onerepo-sentinel -->
