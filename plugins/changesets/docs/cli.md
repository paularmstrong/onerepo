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
| `--version`         | `boolean`             | Show the one Repo CLI version                                                 |          |

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
