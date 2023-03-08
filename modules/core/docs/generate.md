<!-- start-auto-generated-from-cli-generate -->

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

<!-- end-auto-generated-from-cli-generate -->
