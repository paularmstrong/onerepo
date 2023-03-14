---
'@onerepo/core': minor
'onerepo': minor
---

`generate` configurations no longer assume you are only generating workspaces.

- `nameFormat` and `dirnameFormat` options have been removed and you will need to add a prompt for `name` or any other variable that should be rendered into EJS templates.
- `__name__` replacement in filenames has been replaced with EJS templating. Use `<%- name %>` instead.
- `outDir` is now required to be a function and will be passed any variables from the input prompts for generating. Example: `outDir: ({ name }) => path.join(__dirname, '..', '..', 'modules', name),`

To replicate the `name` and `nameFormat` options, you can use the following prompt:

```js
const path = require('path');

module.exports = {
	outDir: ({ name }) => path.join(__dirname, '..', '..', '..', 'modules', name),
	prompts: [
		{
			name: 'name',
			message: 'What is the name of the workspace?',
			suffix: ' @scope/',
			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
		},
	],
};
```
