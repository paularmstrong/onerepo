---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

# Getting started

```sh npm2yarn
npm install --save-dev onerepo
```

```js title="./bin/one.cjs"
#!/usr/bin/env node
const path = require('node:path');

const { setup } = require('onerepo');

(async () => {
	const { run } = await setup(
		/** @type import('onerepo').Config */
		{
			root: path.join(__dirname, '..'),
		}
	);

	await run();
})();
```
