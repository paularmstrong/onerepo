---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

# Getting started

Install dependencies:

```sh npm2yarn
npm install --save-dev onerepo esbuild-register
```

oneRepo creates ESM-compatible modules, sort of. Due to the varying landscape of published modules either building ESM-only, not properly supporting ESM, or not supporting it at all, it is almost impossible to build a pure ESM or CJS-only build of oneRepo. Until such a time comes when it is possible, you will need to register a runtime requires interpreter like `esbuild-register`, `babel-register`, or `ts-node`. We suggest using `esbuild-register` as it will be the fastest tool that should not get in your way.

```js title="./bin/one.cjs"
#!/usr/bin/env node

// Register the requires interpreter before anything else
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
