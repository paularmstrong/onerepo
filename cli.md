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
| `--verbosity`, `-v` | `count`, default: `1` | Set the verbosity of the script output. Use -v, -vv, or -vvv for more verbose |          |
| `--version`         | `boolean`             | Show the one Repo CLI version                                                 |          |

### `one graph`

Run core graph commands

The `graph` command does not accept any positional arguments.

The `graph` command does not accept any option arguments.

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
| `--ignore`          | `array`, default: `["yarn.lock","package-lock.json","pnpm-lock.yaml"]` | List of filepath strings or globs to ignore when matching tasks to files. |          |
| `--list`            | `boolean`                                                              | List found tasks. Implies dry run and will not actually run any tasks.    |          |

### `one test`

Run unit tests

```sh
one test [options]
```

This command also accepts any argument that [vitest accepts](https://vitest.dev/guide/cli.html) and passes them through.

The `test` command does not accept any positional arguments.

| Option                 | Type      | Description                                         | Required |
| ---------------------- | --------- | --------------------------------------------------- | -------- |
| `--affected`           | `boolean` | Run tests related to all affected workspaces        |          |
| `--all`, `-a`          | `boolean` | Lint all files unconditionally                      |          |
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

| Option               | Type                       | Description                                                                                 | Required |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `--add`              | `boolean`                  | Add modified files after write                                                              |          |
| `--affected`         | `boolean`                  | Select all affected workspaces. If no other inputs are chosen, this will default to `true`. |          |
| `--all`, `-a`        | `boolean`                  | Run across all workspaces                                                                   |          |
| `--cache`            | `boolean`, default: `true` | Use cache if available                                                                      |          |
| `--files`, `-f`      | `array`                    | Determine workspaces from specific files                                                    |          |
| `--fix`              | `boolean`, default: `true` | Apply auto-fixes if possible                                                                |          |
| `--workspaces`, `-w` | `array`                    | List of workspace names to run against                                                      |          |

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
| `--workspaces`, `-w` | `array`   | List of workspace names to run against                                                      |          |

### `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

The `docgen` command does not accept any positional arguments.

| Option            | Type                            | Description                                                     | Required |
| ----------------- | ------------------------------- | --------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                       | Add the output file to the git stage                            |          |
| `--bin`           | `string`                        | Path to the OneRepo cli runner. Defaults to the current runner. |          |
| `--format`        | `string`, default: `"markdown"` | Output format for documentation                                 |          |
| `--out-file`      | `string`, default: `"cli.md"`   | File to write output to. If not provided, stdout will be used   |          |
| `--out-workspace` | `string`, default: `"root"`     | Workspace name to write the --out-file to                       |          |

### `one info`

Get information about the repository

The `info` command does not accept any positional arguments.

The `info` command does not accept any option arguments.

#### `one info graph`

Get information about the repository graph

The `graph` command does not accept any positional arguments.

The `graph` command does not accept any option arguments.

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

#### `one workspace @onerepo/graph`

Aliases: `graph`

Runs commands in the `@onerepo/graph` workspace

The `@onerepo/graph` command does not accept any positional arguments.

The `@onerepo/graph` command does not accept any option arguments.

##### `one workspace @onerepo/graph example`

This is an example

The `example` command does not accept any positional arguments.

| Option               | Type    | Description                                          | Required |
| -------------------- | ------- | ---------------------------------------------------- | -------- |
| `--workspaces`, `-w` | `array` | List of workspace names to restrict building against |          |
