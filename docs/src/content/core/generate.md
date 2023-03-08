---
title: Generate
description: |
  Generate workspaces from your own standard templates.
usage: generate
---

# Generate

Generate workspaces from your own standard templates. Since every organization has its own needs and standards, providing a one-size-fits-all solution for scaffolding workspaces is out of scope for oneRepo. However, the `generate` core command provides a helpful way for scaffolding new workspaces.

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
│   ├── __name__.ts.ejs
│   └── package.json.ejs
└── module/
    ├── .onegen.js
    │   ...etc
    └── package.json.ejs
```

The `.onegen.js` file is a configuration file for each template directory that tells oneRepo how to handle and format the output of your workspace:

```js title="templates/module/.onegen.cjs"
const path = require('path');
module.exports = {
	outDir: path.join(__dirname, '..', 'path/to/modules'),
	nameFormat: (name) => `@myscope/${name}`,
	dirnameFormat: (name) => name,
};
```

All other files in the template directory and any sub-directories will be included in the resulting generated output. Any file that uses the extension `.ejs` will be read and parsed using [Embedded JavaScript templating](https://ejs.co/) and the generated files will have that extension stripped, leaving the rendered file with the correct extension in place.

By default, templates will be rendered with the variables `name` and `fullName`. These are determined by the `nameFormat` function provided in your configuration. If not provided, the values of these will be identical.

If a file includes `__name__` in its filename, that string will be replaced with the `name` value given either as a command-line argument or from the inline prompt.

### Template variables

You can also use [inquirer prompts](https://github.com/SBoudrias/Inquirer.js/blob/master/README.md) provided by each `.onegen.cjs` configuration to add more variables to your templates.

```js title="templates/module/.onegen.cjs" {5-11}
module.exports = {
	outDir: path.join(__dirname, '..', 'path/to/modules'),
	nameFormat: (name) => `@myscope/${name}`,
	dirnameFormat: (name) => name,
	prompts: [
		{
			type: 'input',
			name: 'description',
			message: 'Please enter a description for the module',
		},
	],
};
```

Please see the [inquirer documentation](https://github.com/SBoudrias/Inquirer.js/blob/master/README.md) for more options and usage instructions.
