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
