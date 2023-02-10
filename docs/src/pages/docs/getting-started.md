---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

<h1>oneRepo</h1>

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
			core: {
				tasks: { lifecycles: ['pre-commit', 'pull-request'] },
			},
		}
	);

	await run();
})();
```
