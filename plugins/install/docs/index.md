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
