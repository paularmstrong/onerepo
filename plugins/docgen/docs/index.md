---
title: '@onerepo/plugin-docgen'
description: |
  Auto-generate documentation from your oneRepo CLI.
---

## Installation

```js
const { docgen } = require('@onerepo/plugin-docgen');

(async () => {
	const { run } = await setup({
		plugins: [docgen()],
	});

	await run();
})();
```
