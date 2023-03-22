---
title: Generate
description: |
  Generate workspaces from your own standard templates.
usage: generate
---

# Generate

Generate common files, folders, and workspaces from your own standard templates. Since every organization has its own needs and standards, providing a one-size-fits-all solution for scaffolding workspaces and other common files is out of scope for oneRepo. However, the `generate` core command provides a helpful way for creating your own template generators.

## Configuration

First, set the location for oneRepo to look for your templates.

```js {3-5}
setup({
	core: {
		generate: {
			templatesDir: '../path/to/templates',
		},
	},
}).then(({ run }) => run());
```

In your `templatesDir` directory, create folders for different template types. Most use-cases will include separate templates for `app` and `module`. Ensure each template directory includes a `.onegen.js` or `.onegen.cjs` file:

```txt {3,7}
templates/
├── app/
│   ├── .onegen.js
│   └── package.json.ejs
└── module/
    ├── .onegen.js
    └── package.json.ejs
```

The `.onegen.cjs` file is a configuration file for each template directory that tells oneRepo how to handle and format the output of your workspace:

```js title="templates/module/.onegen.cjs"
const path = require('path');
module.exports = {
	outDir: () => path.join(__dirname, '..', 'path/to/output'),
};
```

The above will result in a set of prompts that may look like the following:

```sh
? Choose a template…
    app
  ❯ module
```

All other files in the template directory and any sub-directories will be included in the resulting generated output. Any file that uses the extension `.ejs` will be read and parsed using [Embedded JavaScript templating](https://ejs.co/) and the generated files will have that extension stripped, leaving the rendered file with the correct extension in place.

By default, templates will be rendered with the variables `name` and `fullName`. These are determined by the `nameFormat` function provided in your configuration. If not provided, the values of these will be identical.

Filenames will be rendered using EJS as well. If a file includes something like `<%- name %>.ts.ejs`, the resulting output file will have the name variable replaced inline.

### Template variables

You will likely use [inquirer prompts](https://github.com/SBoudrias/Inquirer.js/blob/master/README.md) provided by each `.onegen.cjs` configuration to add input variables to your templates.

```js title="templates/module/.onegen.cjs" {5-11}
module.exports = {
	outDir: ({ name }) => path.join(__dirname, '..', 'path/to/modules', name),
	prompts: [
		{
			name: 'name',
			question: 'What is the name of the module?',
			prefix: '@scope/',
			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
		},
		{
			type: 'input',
			name: 'description',
			message: 'Please enter a description for the module',
		},
	],
};
```

The above will result in a set of prompts that may look like the following:

```sh
? Choose a template…
    app
  ❯ module
? What is the name of the module? @scope/ ▓
? Please anter a description for the module ▓
```

Please see the [inquirer documentation](https://github.com/SBoudrias/Inquirer.js/blob/master/README.md) for more options and usage instructions.

### Options

<!-- start-usage-typedoc -->

This content will be auto-generated. Do not edit

<!-- end-usage-typedoc -->

## Usage

<!-- start-auto-generated-from-cli-generate -->

This content will be auto-generated. Do not edit

<!-- end-auto-generated-from-cli-generate -->
