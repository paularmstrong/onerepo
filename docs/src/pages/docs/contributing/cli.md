---
layout: '../../../layouts/Docs.astro'
title: oneRepo internal CLI
description: oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage for the local CLI auto-generated docs using the docgen plugin.
---

# Internal CLI

oneRepo uses itself to manage itself! Very meta. The following is the repo’s usage documentation for the local CLI – all auto-generated docs using the [docgen plugin](/docs/plugins/docgen/).

<!-- start-auto-generated-from-cli -->

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

### `one change`

Aliases: `changeset`, `changesets`

Manage changesets, versioning, and publishing your public workspaces to packages.

```sh
one change <command> [options]
```

#### `one change add`

Aliases: `$0`

Add a changeset

```sh
one change add [options]
```

| Option               | Type                            | Description                                                                                                         | Required |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`, default: `true`      | Add the modified `package.json` files to the git stage for committing.                                              |          |
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

#### `one change init`

Initialize changesets for this repository.

```sh
one change init
```

You should only ever have to do this once.

#### `one change prerelease`

Aliases: `pre-release`, `pre`

Pre-release available workspaces.

```sh
one change prerelease
```

| Option              | Type                                | Description                                                                                   | Required |
| ------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| `--build`           | `boolean`, default: `true`          | Build workspaces before publishing                                                            |          |
| `--otp`             | `boolean`                           | Set to true if your publishes require an OTP for NPM.                                         |          |
| `--package-manager` | `"yarn"`, `"npm"`, default: `"npm"` | Package manager to use for publishing                                                         |          |
| `--skip-auth`       | `boolean`                           | Skip NPM auth check. This may be necessary for some internal registries using PATs or tokens. |          |

<details>

<summary>Advanced options</summary>

| Option          | Type      | Description                                                 | Required |
| --------------- | --------- | ----------------------------------------------------------- | -------- |
| `--allow-dirty` | `boolean` | Bypass checks to ensure no local changes before publishing. |          |

</details>

#### `one change publish`

Aliases: `release`

Publish all workspaces with versions not available in the registry.

```sh
one change publish [options]
```

This command is safe to run any time – only packages that have previously gone through the `version` process will end up being published.

| Option              | Type                                | Description                                                                                   | Required |
| ------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| `--build`           | `boolean`, default: `true`          | Build workspaces before publishing                                                            |          |
| `--otp`             | `boolean`                           | Set to true if your publishes require an OTP for NPM.                                         |          |
| `--package-manager` | `"yarn"`, `"npm"`, default: `"npm"` | Package manager to use for publishing                                                         |          |
| `--skip-auth`       | `boolean`                           | Skip NPM auth check. This may be necessary for some internal registries using PATs or tokens. |          |

<details>

<summary>Advanced options</summary>

| Option          | Type      | Description                                                 | Required |
| --------------- | --------- | ----------------------------------------------------------- | -------- |
| `--allow-dirty` | `boolean` | Bypass checks to ensure no local changes before publishing. |          |

</details>

#### `one change version`

Version workspaces for publishing. Allows you to select a minimal set of workspaces from the current changesets, version them, and write changelogs.

```sh
one change version
```

| Option  | Type                       | Description                                                                                          | Required |
| ------- | -------------------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| `--add` | `boolean`, default: `true` | Add the modified files like `package.json` and `CHANGELOG.md` files to the git stage for committing. |          |

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

Help documentation should always be easy to find. This command will help automate the creation of docs for this command-line interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

| Option            | Type                                                           | Description                                                                | Required |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                                                      | Add the output file to the git stage                                       |          |
| `--bin`           | `string`                                                       | Path to the OneRepo cli runner. Defaults to the current runner.            |          |
| `--format`        | `"markdown"`, `"json"`, default: `"markdown"`                  | Output format for documentation                                            |          |
| `--heading-level` | `number`                                                       | Heading level to start at for Markdown output                              |          |
| `--out-file`      | `string`, default: `"docs/src/pages/docs/contributing/cli.md"` | File to write output to. If not provided, stdout will be used              |          |
| `--out-workspace` | `string`, default: `"root"`                                    | Workspace name to write the --out-file to                                  |          |
| `--safe-write`    | `boolean`, default: `true`                                     | Write documentation to a portion of the file with start and end sentinels. |          |

<details>

<summary>Advanced options</summary>

| Option      | Type     | Description                                              | Required |
| ----------- | -------- | -------------------------------------------------------- | -------- |
| `--command` | `string` | Start at the given command, skip the root and any others |          |

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

This command can generate representations of your workspace graph for use in debugging, verifying, and documentation.

| Option               | Type                                                 | Description                                                                                 | Required |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean`                                            | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                                            | Run across all workspaces                                                                   |          |
| `--format`           | `"mermaid"`, `"plain"`, `"json"`, default: `"plain"` | Output format for inspecting the dependency graph                                           |          |
| `--workspaces`, `-w` | `array`                                              | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type     | Description                                               | Required |
| --------------- | -------- | --------------------------------------------------------- | -------- |
| `--from-ref`    | `string` | Git ref to start looking for affected files or workspaces |          |
| `--through-ref` | `string` | Git ref to start looking for affected files or workspaces |          |

</details>

Generate a mermaid graph to a file, isolating just the given `<workspace>` and those that are dependent on it.

```sh
one graph show --format=mermaid -w <workspace> > ./out.mermaid
```

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

Run eslint across files and workspaces

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

| Option               | Type                                                                                                                                                                                                                                                                            | Description                                                                                                 | Required |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean`                                                                                                                                                                                                                                                                       | Select all affected workspaces. If no other inputs are chosen, this will default to `true`.                 |          |
| `--all`, `-a`        | `boolean`                                                                                                                                                                                                                                                                       | Run across all workspaces                                                                                   |          |
| `--lifecycle`, `-c`  | `"pre-commit"`, `"commit"`, `"post-commit"`, `"pre-checkout"`, `"checkout"`, `"post-checkout"`, `"pre-merge"`, `"merge"`, `"post-merge"`, `"pre-build"`, `"build"`, `"post-build"`, `"pre-deploy"`, `"deploy"`, `"post-deploy"`, `"pre-publish"`, `"publish"`, `"post-publish"` | Task lifecycle to run. `pre-` and `post-` lifecycles will automatically be run for non-prefixed lifecycles. | ✅       |
| `--list`             | `boolean`                                                                                                                                                                                                                                                                       | List found tasks. Implies dry run and will not actually run any tasks.                                      |          |
| `--workspaces`, `-w` | `array`                                                                                                                                                                                                                                                                         | List of workspace names to run against                                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                                                                   | Description                                                               | Required |
| --------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                                                                               | Git ref to start looking for affected files or workspaces                 |          |
| `--ignore`      | `array`, default: `[".changesets/*","**/README.md","**/CHANGELOG.md",".changeset/**"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--through-ref` | `string`                                                                               | Git ref to start looking for affected files or workspaces                 |          |

</details>

### `one test`

Run unit tests using Vitest

```sh
one test vitest [options] -- [passthrough]
one test [options]
```

This test commad will automatically attempt to run only the test files related to the changes in your git branch. By passing specific filepaths as extra passthrough arguments after two dashes (`--`), you can further restrict the tests to those specific files only.

Additionally, any other [Vitest CLI options](https://vitest.dev/guide/cli.html) can be passed as passthrough arguments as well.

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
| `--affected`         | `boolean` | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean` | Run across all workspaces                                                                   |          |
| `--inspect`          | `boolean` | Break for the the Node inspector to debug tests.                                            |          |
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

<details>

<summary>Advanced options</summary>

| Option          | Type                                             | Description                                                | Required |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------- | -------- |
| `--config`      | `string`, default: `"./config/vitest.config.ts"` | Path to the vitest.config file, relative to the repo root. |          |
| `--from-ref`    | `string`                                         | Git ref to start looking for affected files or workspaces  |          |
| `--through-ref` | `string`                                         | Git ref to start looking for affected files or workspaces  |          |

</details>

Run only tests related to modified files.

```sh
one test vitest
```

Run vitest in --watch mode.

```sh
one test vitest -- --watch
```

Run vitest in watch mode with a particular file.

```sh
one test vitest -- -w path/to/test.ts
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

#### `one workspace @onerepo/core`

Aliases: `core`

Runs commands in the `@onerepo/core` workspace

##### `one workspace @onerepo/core docgen`

Generate docs for the oneRepo core

| Option  | Type      | Description                              | Required |
| ------- | --------- | ---------------------------------------- | -------- |
| `--add` | `boolean` | Add all generated files to the git stage |          |

#### `one workspace @onerepo/docs`

Aliases: `docs`

Runs commands in the `@onerepo/docs` workspace

##### `one workspace @onerepo/docs astro`

Run astro commands.

```sh
one workspace @onerepo/docs astro
```

##### `one workspace @onerepo/docs collect-content`

Generate docs for the oneRepo monorepo

| Option               | Type      | Description                                                                                 | Required |
| -------------------- | --------- | ------------------------------------------------------------------------------------------- | -------- |
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

##### `one workspace @onerepo/docs start`

Start the docs development server

```sh
one workspace @onerepo/docs start
```

##### `one workspace @onerepo/docs typedoc`

Generate typedoc markdown files for the toolchain.

```sh
one workspace @onerepo/docs typedoc
```

<!-- end-auto-generated-from-cli -->
