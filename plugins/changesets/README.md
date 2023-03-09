[Changesets](https://github.com/changesets/changesets) are a way to manage versioning and changelogs in monorepos.

## Installation

```sh
npm install --save-dev @onerepo/plugin-changesets
```

```js {1,5-7}
const { changesets } = require('@onerepo/plugin-changesets');

setup({
	plugins: [
		changesets({
			// ...options
		}),
	],
}).then(({ run }) => run());
```

## Publish config

In order to properly use source-level dependencies without requiring constant file watching and rebuilding across workspaces, all `package.json` files should reference a _source_ file in its `"main"` field, eg, `"main": "./src/index.ts"`.

This causes issues when publishing shared modules for use outside of the monorepo, because consumers will likely need to use a pre-compiled version of the module. In order to safely rewrite this, as well as some other related fields, we build upon NPM’s [`publishConfig`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#publishconfig) to include other fields: `bin`, `main`, `module`, `typings`, and `exports`. The presence of any of these fields in your `publishConfig` will trigger this plugin’s commands to overwrite the initial values during the publish cycle:

<div class="grid grid-cols-2 gap-4">

```json title="source package.json"
{
	"name": "my-package",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/src/index.d.ts"
	}
}
```

```json title="published package.json"
{
	"name": "my-package",
	"main": "./dist/index.js",
	"typings": "./dist/src/index.d.ts"
}
```

</div>

## Workflow

1. For every change that should be documented in a changelog, add a changeset using the `add` command. This command will walk you through itself, prompting for information for each modified workspace:

   ```sh
   one change add
   ```

   Commit any files that are added during this process. You can always go back and edit these files manually, as long as they exist.

1. When you have enough changes and you’re ready to publish, run the [version](#one-changesets-version) command.

   ```sh
   one change version
   ```

   This will also prompt you for the workspaces that you want to publish. You can restrict this to avoid publishing any workspaces that are not yet ready.

   However, any dependency in the graph of the chosen workspace(s) that has changes will also be versioned and published at this time. This is an important step to ensure consumers external to your oneRepo have all of the latest changes.

   This command will delete the consumed changesets, write changelogs, and update version numbers across all modified workspaces. Commit these changes and review them using a pull-request.

1. Once the pull-request is merged, you can safely run the [publish](#one-changesets-publish) command:

   ```sh
    one change publish
   ```

<aside>

This plugin will trigger the [core `tasks`](https://onerepo.tools/docs/core/tasks/) `build` lifecycle for every workspace during pre-release and publish. There is no need to manually run a build before publishing.

</aside>
