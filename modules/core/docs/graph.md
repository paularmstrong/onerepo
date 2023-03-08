<!-- start-auto-generated-from-cli-graph -->

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

<!-- end-auto-generated-from-cli-graph -->
