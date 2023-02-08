---
title: '@onerepo/plugin-vitest'
description: |
  Run Vitest tests across your repository.
---

## Installation

```js
const { vitest } = require('@onerepo/plugin-vitest');

(async () => {
	const { run } = await setup({
		plugins: [vitest()],
	});

	await run();
})();
```
