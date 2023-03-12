# oneRepo

[![Build status](https://img.shields.io/github/actions/workflow/status/paularmstrong/onerepo/merge-main.yaml?branch=main)](https://github.com/paularmstrong/onerepo/actions/workflows/merge-main.yaml) [![NPM version](https://img.shields.io/npm/v/onerepo)](https://npmjs.com/package/onerepo) ![Netlify](https://img.shields.io/netlify/f544fa4c-f2ad-4b59-83a0-933daa0b0b31)

## Documentation

https://onerepo.tools/docs/

## Quick start

````shInstall dependencies using your package manager of choice.

```sh
# With Yarn
yarn add --dev onerepo

# With NPM
npm install --save-dev onerepo
````

Create an entrypoint for you CLI. Not that this file _should_ be ESM-compatible. Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

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

## Why another monorepo tool?

Current monorepo tooling either does too much or not enough in order to maintain a healthy monorepo for distributed organizations that need conformance, stability, and discoverability.

Many tools available rely on writing individual scripts into each workspace in a monorepo’s `package.json` file. This creates both a brittle setup as well as boilerplate and reduced reusability.

Furthermore, it is difficult to remember how to run scripts in individual workspaces due to lack of documentation on `package.json` scripts – and other tooling does not provide a way to enforce standards or help developers find what they’re looking for – relying instead on manual documentation, or worse, memory.

## The oneRepo solution

**oneRepo** is a set of tools for creating monorepos that start with helpful defaults and opt-in to strict conformance, while allowing escape-hatches when you need something different. The main goal of the oneRepo toolset is to enable speed with confidence.

oneRepo comes out of the box with four major pieces, each built upon the previous:

1. A command-line interface
1. A workspace graph
1. A smart and fast task-runner
1. Plugins and extensibility

### Commandline interface

- Extendable with custom commands for your team
- Ensures documentation
- Ensures command discoverability and help documentation
- Ensures all workspaces in your repo use the same build/test pipeline, with the ability to extend or opt-out of defaults

### Workspace graph traversal

- Prevent cyclical dependencies
- Determine how changes affect workspaces
- Run tasks on subsets of workspaces
  - Based files changed, manual input, etc
- Workspace validation
  - Ensure no conflicting shared dependency versions
  - Ensure `package.json` conformance

### Task runner

- Fast
  - Run your tools limited to files and directly affected changes quickly
  - Isolate files or individual workspaces locally
- Always confident
  - Relies on change isolation, not cache: ensures all dependents in the graph are run for all affecting changes
  - Ignores unaffected workspaces

## License

MIT License

Copyright © 2023 Paul Armstrong
