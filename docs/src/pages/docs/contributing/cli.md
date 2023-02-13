---
layout: '../../../layouts/Docs.astro'
title: oneRepo internal CLI
description: oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage for the local CLI auto-generated docs using the docgen plugin.
---

# Internal CLI

oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage for the local CLI auto-generated docs using the [docgen plugin](/docs/plugins/docgen/).

<!-- start-onerepo-sentinel -->

## `one`

```sh
one <command> [options]
```

The `one` command does not accept any positional arguments.

| Option              | Type                  | Description                                                                   | Required |
| ------------------- | --------------------- | ----------------------------------------------------------------------------- | -------- |
| `--ci`              | `boolean`             | Sets defaults for running scripts in a CI environment                         |          |
| `--dry-run`         | `boolean`             | Run without actually making modifications or destructive operations           |          |
| `--help`, `-h`      | `boolean`             | Show this help screen                                                         |          |
| `--show-advanced`   | `boolean`             | Show advanced options                                                         |          |
| `--silent`          | `boolean`             | Silence all output from the logger. Effectively sets verbosity to 0.          |          |
| `--verbosity`, `-v` | `count`, default: `2` | Set the verbosity of the script output. Use -v, -vv, or -vvv for more verbose |          |
| `--undefined`       | ``                    |                                                                               |          |

### `one graph`

Run core graph commands

The `graph` command does not accept any positional arguments.

The `graph` command does not accept any option arguments.

#### `one graph show`

Show the dependency graph.

The `show` command does not accept any positional arguments.

| Option     | Type                         | Description                                       | Required |
| ---------- | ---------------------------- | ------------------------------------------------- | -------- |
| `--format` | `string`, default: `"plain"` | Output format for inspecting the dependency graph |          |

#### `one graph verify`

Verify the integrity of the repo’s dependency graph.

```sh
one graph verify verify
```

The `verify` command does not accept any positional arguments.

| Option        | Type | Description | Required |
| ------------- | ---- | ----------- | -------- |
| `--undefined` | ``   |             |          |

### `one install`

Install the oneRepo CLI into your environment.

`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.

As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).

The `install` command does not accept any positional arguments.

| Option        | Type                       | Description                                                                                                         | Required |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--name`      | `string`, default: `"one"` | Name of the command to install                                                                                      | ✅       |
| `--force`     | `boolean`                  | Force installation regardless of pre-existing command.                                                              |          |
| `--location`  | `string`                   | Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type. |          |
| `--undefined` | ``, default: `2`           |                                                                                                                     |          |

### `one tasks`

Run tasks

The `tasks` command does not accept any positional arguments.

| Option              | Type                                                                   | Description                                                               | Required |
| ------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `--lifecycle`, `-c` | `string`                                                               | Task lifecycle to run                                                     | ✅       |
| `--from-ref`        | `string`                                                               | Git ref to start looking for affected files or workspaces                 |          |
| `--ignore`          | `array`, default: `["yarn.lock","package-lock.json","pnpm-lock.yaml"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--list`            | `boolean`                                                              | List found tasks. Implies dry run and will not actually run any tasks.    |          |
| `--through-ref`     | `string`                                                               | Git ref to start looking for affected files or workspaces                 |          |

### `one changesets`

Aliases: `change`

Manage changesets

```sh
one changesets <command> [options]
```

The `changesets` command does not accept any positional arguments.

The `changesets` command does not accept any option arguments.

#### `one changesets add`

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

#### `one changesets init`

Initialize changesets for this repository.

You should only ever have to do this once.

The `init` command does not accept any positional arguments.

The `init` command does not accept any option arguments.

#### `one changesets prepare`

Prepare workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

The `prepare` command does not accept any positional arguments.

The `prepare` command does not accept any option arguments.

#### `one changesets prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

The `prerelease` command does not accept any positional arguments.

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |

### `one test`

Run unit tests

```sh
one test [options]
```

This command also accepts any argument that [vitest accepts](https://vitest.dev/guide/cli.html) and passes them through.

The `test` command may accept an unknown set of positional arguments.

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

### `one lint`

Lint files using eslint

```sh
one lint [options]
```

The `lint` command does not accept any positional arguments.

| Option               | Type                                                            | Description                                                                                 | Required |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`                                                       | Add modified files after write                                                              |          |
| `--affected`         | `boolean`                                                       | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                                                       | Run across all workspaces                                                                   |          |
| `--cache`            | `boolean`, default: `true`                                      | Use cache if available                                                                      |          |
| `--extensions`       | `array`, default: `["ts","tsx","js","jsx","cjs","mjs","astro"]` |                                                                                             |          |
| `--files`, `-f`      | `array`                                                         | Determine workspaces from specific files                                                    |          |
| `--fix`              | `boolean`, default: `true`                                      | Apply auto-fixes if possible                                                                |          |
| `--from-ref`         | `string`                                                        | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`                                                        | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`                                                         | List of workspace names to run against                                                      |          |

### `one format`

Format files with prettier

```sh
one format [options]
```

The `format` command does not accept any positional arguments.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean` | Add modified files after write                                                              |          |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--check`            | `boolean` | Check for changes.                                                                          |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                    |          |
| `--from-ref`         | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

### `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

The `docgen` command does not accept any positional arguments.

| Option            | Type                                                           | Description                                                                | Required |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                                                      | Add the output file to the git stage                                       |          |
| `--bin`           | `string`                                                       | Path to the OneRepo cli runner. Defaults to the current runner.            |          |
| `--command`       | `string`                                                       | Start at the given command, skip the root and any others                   |          |
| `--format`        | `string`, default: `"markdown"`                                | Output format for documentation                                            |          |
| `--out-file`      | `string`, default: `"docs/src/pages/docs/contributing/cli.md"` | File to write output to. If not provided, stdout will be used              |          |
| `--out-workspace` | `string`, default: `"root"`                                    | Workspace name to write the --out-file to                                  |          |
| `--safe-write`    | `boolean`, default: `true`                                     | Write documentation to a portion of the file with start and end sentinels. |          |

### `one generate`

Aliases: `gen`

Generate workspaces from template directories.

```sh
one generate,gen [options]
```

To create new templates add a new folder to commands/templates and create a `.onegen.cjs` configuration file. Follow the instructions online for more: https\://onerepo.tools/docs/plugins/generate/

The `generate` command does not accept any positional arguments.

| Option            | Type                                                                               | Description                                                                                  | Required |
| ----------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- |
| `--templates-dir` | `string`, default: `"/Users/paularmstrong/development/onerepo/commands/templates"` | Path to the templates                                                                        | ✅       |
| `--name`          | `string`                                                                           | Name of the workspace to generate. If not provided, you will be prompted to enter one later. |          |
| `--type`, `-t`    | `string`                                                                           | Template type to generate. If not provided, a list will be provided to choose from.          |          |

### `one build`

Build public workspaces using esbuild.

```sh
one build [options]
```

The `build` command does not accept any positional arguments.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--from-ref`         | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--version`          | `string`  | Manually set the version of the built workspaces.                                           |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

Build all workspaces.

```sh
$0 build
```

Build the `graph` workspace only.

```sh
$0 build -w graph
```

Build the `graph`, `cli`, and `logger` workspaces.

```sh
$0 build -w graph cli logger
```

### `one docgen-internal`

Generate docs for the oneRepo monorepo

The `docgen-internal` command does not accept any positional arguments.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean` | Add all generated files to the git stage                                                    |          |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--files`, `-f`      | `array`   | Determine workspaces from specific files                                                    |          |
| `--from-ref`         | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

### `one publish`

Build public workspaces using esbuild.

```sh
one publish [options]
```

The `publish` command does not accept any positional arguments.

| Option    | Type                       | Description                                           | Required |
| --------- | -------------------------- | ----------------------------------------------------- | -------- |
| `--build` | `boolean`, default: `true` | Build workspaces before publishing                    |          |
| `--otp`   | `boolean`                  | Set to true if your publishes require an OTP for NPM. |          |
| `--pre`   | `boolean`                  | Create a pre-release                                  |          |

### `one tsc`

Run typescript checking across workspaces

```sh
one tsc [options]
```

The `tsc` command does not accept any positional arguments.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--from-ref`         | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`  | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

### `one workspace`

Aliases: `$0`, `ws`

Run workspace-specific commands

```sh
one workspace <name> <command> [options]
one ws <name> <command> [options]
```

Add commands to the `commands` directory within a workspace to create workspace-specific commands.

The `workspace` command does not accept any positional arguments.

The `workspace` command does not accept any option arguments.

#### `one workspace @onerepo/docs`

Aliases: `docs`

Runs commands in the `@onerepo/docs` workspace

The `@onerepo/docs` command does not accept any positional arguments.

The `@onerepo/docs` command does not accept any option arguments.

##### `one workspace @onerepo/docs astro`

Run astro commands.

```sh
one workspace @onerepo/docs astro astro
```

The `astro` command does not accept any positional arguments.

The `astro` command does not accept any option arguments.

##### `one workspace @onerepo/docs start`

Start the docs development server

```sh
one workspace @onerepo/docs start start
```

The `start` command does not accept any positional arguments.

The `start` command does not accept any option arguments.

<!-- end-onerepo-sentinel -->
