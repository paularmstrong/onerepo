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

### `one docgen`

Generate documentation for this CLI.

```sh
one docgen [options]
```

Help documentation should always be easy to find. This command will help automate the creation of docs for this commandline interface. If you are reading this somewhere that is not your terminal, there is a very good chance that this command was already run for you!

Add this command to your one Repo tasks on pre-commit to ensure that your documentation is always up-to-date.

The `docgen` command does not accept any positional arguments.

| Option            | Type                        | Description                                                     | Required |
| ----------------- | --------------------------- | --------------------------------------------------------------- | -------- |
| `--add`           | `boolean`                   | Add the output file to the git stage                            |          |
| `--bin`           | `string`                    | Path to the OneRepo cli runner. Defaults to the current runner. |          |
| `--format`        | `string`, default: `"json"` | Output format for documentation                                 |          |
| `--out-file`      | `string`                    | File to write output to. If not provided, stdout will be used   |          |
| `--out-workspace` | `string`                    | Workspace name to write the --out-file to                       |          |
