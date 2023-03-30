---
layout: '../../layouts/Docs.astro'
title: Getting started with oneRepo
---

# Getting started

```sh
# With Yarn
yarn create @onerepo

# With NPM
npm create @onerepo
```

## Manually integrating oneRepo

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

## TypeScript support

Due to [missing support for ESM](https://github.com/yargs/yargs/issues/571) in our CLI parser, `esbuild` is provided as a runtime interpreter (using `esbuild-register`). This ensures maximum compatibility for most environments and also allows you to write custom commands with TypeScript.

No additional setup should be required.
