---
'@onerepo/core': minor
'onerepo': minor
---

Adds `name` and `description` options to template generation configs.

```js title=".onegen.js"
export default {
	name: 'Module',
	description: 'A description for the module to generate',
	prompts: [],
};
```

```
 ┌ Get template
 └ ⠙
? Choose a template… (Use arrow keys)
❯ Command - Create a repo-local command
  Module - Create a shared workspace in modules/
  Plugin - Create a publishable oneRepo plugin
```
