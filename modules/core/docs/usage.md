---
title: Usage
---

# Command-line interface usage

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
| `--ci`         | `boolean` | Sets defaults for running scripts in a CI environment                |          |
| `--help`, `-h` | `boolean` | Show this help screen                                                |          |
| `--silent`     | `boolean` | Silence all output from the logger. Effectively sets verbosity to 0. |          |

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

| Option          | Type                                  | Description                                                               | Required |
| --------------- | ------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `--from-ref`    | `string`                              | Git ref to start looking for affected files or workspaces                 |          |
| `--ignore`      | `array`, default: `[".changesets/*"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--through-ref` | `string`                              | Git ref to start looking for affected files or workspaces                 |          |

</details>

<!-- end-auto-generated-from-cli -->
