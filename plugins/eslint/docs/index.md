---
title: '@onerepo/plugin-eslint'
description: |
  Add easy and fast linting with Eslint to your repo through one simple plugin.
---

## Installation

```js
const { eslint } = require('@onerepo/plugin-eslint');

(async () => {
	const { run } = await setup({
		plugins: [eslint()],
	});

	await run();
})();
```
