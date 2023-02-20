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

require('esbuild-register/dist/node').register({});

const path = require('node:path');
const { setup } = require('onerepo');

setup(
	/** @type import('onerepo').Config */
	{
		root: path.join(__dirname, '..'),
	}
).then(({ run }) => run());
```
