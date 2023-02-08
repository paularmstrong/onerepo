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
| `--from-ref`         | `string`                   | Git ref to start looking for affected files or workspaces                                   |          |
| `--through-ref`      | `string`                   | Git ref to start looking for affected files or workspaces                                   |          |
| `--workspaces`, `-w` | `array`                    | List of workspace names to run against                                                      |          |
