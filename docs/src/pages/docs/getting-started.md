---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

# Getting started

Install dependencies using your package manager of choice.

```sh
# With Yarn
yarn add --dev onerepo

# With NPM
npm install --save-dev onerepo
```

Create an entrypoint for you CLI. Not that this file _**MUST**_ be ESM-compatible because **oneRepo** is not built with commonjs support. Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

```js title="./bin/one.mjs"
#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setup } from 'onerepo';

setup({
	root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
}).then(({ run }) => run());
```

Next ensure your command is executable:

```sh
chmod a+x ./bin/one.mjs
```

Finally, install the CLI using the [install core command](/docs/core/install/).

```sh
./bin/one.mjs install
```

## Using TypeScript

If you are already using TypeScript in your repository and you would like your commands to be type-safe and written with TypeScript, you will need a runtime interpreter. Esbuild is recommended as our testing has shown it to be the fastest and will prevent extra load times when attempting to run commands.

```sh
# With Yarn
yarn add --dev esbuild esbuild-register

# With NPM
npm install --save-dev esbuild esbuild-register
```

```js title="./bin/one.mjs" showLineNumbers {6-8,11}
#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setup } from 'onerepo';

// Register the requires interpreter before continuing to enable TypeScript commands
import { register } from 'esbuild-register/dist/node';
register({});

setup(
	/** @type import('onerepo').Config */
	{
		root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
	}
).then(({ run }) => run());
```
