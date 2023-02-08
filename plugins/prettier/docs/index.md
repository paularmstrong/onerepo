---
title: '@onerepo/plugin-prettier'
description: |
  Format files as they change using Prettier.
---

## Installation

```js
const { prettier } = require('@onerepo/plugin-prettier');

(async () => {
	const { run } = await setup({
		plugins: [prettier()],
	});

	await run();
})();
```
