<!-- start-auto-generated-from-cli-tasks -->

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

<!-- end-auto-generated-from-cli-tasks -->
