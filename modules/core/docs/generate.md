---
title: Generate
description: |
  Generate workspaces from your own standard templates.
---

# Generate

## Configuration

```js {3-6}
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
