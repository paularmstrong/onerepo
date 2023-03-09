---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

# Getting started

Install dependencies using your package manager of choice.

```sh
# With Yarn
yarn add --dev onerepo esbuild-register

# With NPM
npm install --save-dev onerepo esbuild-register
```

Create an entrypoint for you CLI.

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

Next ensure your command is executable:

```sh
chmod a+x ./bin/one.cjs
```

Finally, install the CLI using the [install core command](/docs/core/install/).

```sh
./bin/one.cjs install
```
