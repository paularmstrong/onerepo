---
title: '@onerepo/plugin-generate'
tool: Generate
description: |
  Generate workspaces from your own standard templates.
---

## Installation

```sh
npm install --save-dev @onerepo/plugin-generate
```

```js {1,5-8}
const { generate } = require('@onerepo/plugin-generate');

setup({
	plugins: [
		generate({
			templatesDir: '../path/to/templates',
			// ...options
		}),
	],
}).then(({ run }) => run());
```

In your `templatesDir` directory, create folders for different template types. Most use-cases will include separate templates for `app` and `module`:

```txt
templates/
├── app/
│   ├── .onegen.cjs
│   ├── __name__.ts.ejs
│   └── package.json.ejs
└── module/
    ├── .onegen.cjs
    │   ...etc
    └── package.json.ejs
```

Ensure each template directory includes a `.onegen.cjs` file that includes all configuration variables. Change all values as necessary:

```js title="templates/module/.onegen.cjs"
const path = require('path');
module.exports = {
	outDir: path.join(__dirname, '..', 'path/to/modules'),
	nameFormat: (name) => `@myscope/${name}`,
	dirnameFormat: (name) => name,
};
```

All other files in the template directory and any sub-directories will be included in the resulting generated output. Any file that uses the extension `.ejs` will be read and parsed using [Embedded JavaScript templating](https://ejs.co/) and the generated files will have that extension stripped, leaving the rendered file with the correct extension in place. Currently, the only supported variables are `<%- name %>`.

If a file includes `__name__` in its filename, that string will be replaced with the `name` value given either as a command-line argument or from the inline prompt.

<!-- start-onerepo-sentinel -->

## `one generate`

Aliases: `gen`

Generate workspaces from template directories.

```sh
one generate [options]
```

To create new templates add a new folder to and create a `.onegen.cjs` configuration file. Follow the instructions online for more: https\://onerepo.tools/docs/plugins/generate/

| Option         | Type     | Description                                                                                  | Required |
| -------------- | -------- | -------------------------------------------------------------------------------------------- | -------- |
| `--name`       | `string` | Name of the workspace to generate. If not provided, you will be prompted to enter one later. |          |
| `--type`, `-t` | `string` | Template type to generate. If not provided, a list will be provided to choose from.          |          |

<details>

<summary>Advanced options</summary>

| Option            | Type     | Description           | Required |
| ----------------- | -------- | --------------------- | -------- |
| `--templates-dir` | `string` | Path to the templates | ✅       |

</details>

<!-- end-onerepo-sentinel -->
