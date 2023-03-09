# oneRepo Core

At the center of oneRepo is a toolchain for managing monorepo workspace graphs using a unified command-line interface.

## Installation

Core command-line configuration is provided by the root package, `onerepo`.

```sh
# With Yarn
yarn add --dev onerepo esbuild-register

# With NPM
npm install --save-dev onerepo esbuild-register
```

oneRepo creates ESM-compatible modules, sort of. Due to the varying landscape of published modules either building ESM-only, not properly supporting ESM or at all, it is almost impossible to build a pure ESM or CJS-only build of oneRepo. Until such a time comes when it is possible, you will need to register a runtime requires interpreter like `esbuild-register`, `babel-register`, or `ts-node`. We suggest using `esbuild-register` as it will be the fastest tool that should not get in your way.

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

## Custom commands

Every team, repo, and workspace has unique needs. oneRepo shines when it comes to doing what you need at the right time.

> TODO: writing commands
