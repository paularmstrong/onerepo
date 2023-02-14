---
title: '@onerepo/plugin-install'
description: |
  Install your repository’s CLI into your path, making it easy to use from anywhere!
type: core
---

## Installation

This is a core plugin that does not need to be installed manually.

## Disabling

```js
(async () => {
	const { run } = await setup({
		core: {
			// Disable the install plugin
			install: false,
		},
	});

	await run();
})();
```

<!-- start-onerepo-sentinel -->

## `one install`

Install the oneRepo CLI into your environment.

`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.

As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).

| Option       | Type                       | Description                                                                                                         | Required |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--force`    | `boolean`                  | Force installation regardless of pre-existing command.                                                              |          |
| `--location` | `string`                   | Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type. |          |
| `--name`     | `string`, default: `"one"` | Name of the command to install                                                                                      | ✅       |

<!-- end-onerepo-sentinel -->
