# @onerepo/core

## 0.5.0

### Minor Changes

- `@onerepo/plugin-docgen` has been moved to a core command. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

  As a core command it is faster and more reliable and will work across more setups.

- `docgen` no longer supports the `--bin` flag. It will automatically use the same configuration and setup from the current CLI. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

- `graph show --format=mermaid` now differentiates private and public workspaces using different node shapes. [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34) ([@paularmstrong](https://github.com/paularmstrong))

- Adds alias `-f` for `--format` to `graph show` [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.0

### Minor Changes

- Adds CJSON (Commented JavaScript Object Notation) support to `one graph verify`. This opens the ability to check `tsconfig.json` and other cjson-supporting configurations without throwing errors when reading the files. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- CLI in-point is now recommended to be ESM-compatible [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

  Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

  ```js title="./bin/one.mjs"
  #!/usr/bin/env node
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import { setup } from 'onerepo';

  setup({
  	root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
  }).then(({ run }) => run());
  ```

  If using TypeScript, continue to use `esbuild-register`, but import `onerepo` modules and plugins before the `register()` call.

- `generate` configurations no longer assume you are only generating workspaces. [#175](https://github.com/paularmstrong/onerepo/pull/175) ([@paularmstrong](https://github.com/paularmstrong))

  - `nameFormat` and `dirnameFormat` options have been removed and you will need to add a prompt for `name` or any other variable that should be rendered into EJS templates.
  - `__name__` replacement in filenames has been replaced with EJS templating. Use `<%- name %>` instead.
  - `outDir` is now required to be a function and will be passed any variables from the input prompts for generating. Example: `outDir: ({ name }) => path.join(__dirname, '..', '..', 'modules', name),`

  To replicate the `name` and `nameFormat` options, you can use the following prompt:

  ```js
  const path = require('path');

  module.exports = {
  	outDir: ({ name }) => path.join(__dirname, '..', '..', '..', 'modules', name),
  	prompts: [
  		{
  			name: 'name',
  			message: 'What is the name of the workspace?',
  			suffix: ' @scope/',
  			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  		},
  	],
  };
  ```

- Adds JS/TS configuration validation support to `one graph verify`. This allows checking files like `jest.config.js` or `vite.config.ts` for minimum requirements across your workspaces and ensure they're kept up to date as your projects and infrastructure evolve. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- Adds YAML support to `one graph verify`. This opens the ability to check common yaml configuration files that apps in your monorepo depend on to ensure minimum standards are set and kept up to date. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- After running `one generate` and any file created from the template is a `package.json`, the command will run the package manager’s `install` command before exiting. [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

- CLI `setup()` will now use `esbuild-register` automatically. Users should not need to set any runtime interpreter manually and can safely remove this previous requirement if already in place. [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Error output from `graph verify` against schema will more clearly explain which file(s) include which error(s). [#184](https://github.com/paularmstrong/onerepo/pull/184) ([@paularmstrong](https://github.com/paularmstrong))

- Prevents running affected workspaces in `tasks` when `--no-affected` is explicitly passed to the command. [#182](https://github.com/paularmstrong/onerepo/pull/182) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`ac93c89`](https://github.com/paularmstrong/onerepo/commit/ac93c898da6d59ee3e161b27e17c4785c28b1b39), [`68018fe`](https://github.com/paularmstrong/onerepo/commit/68018fe439e6ce7bbbd12c71d8662779692a66d4), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/graph@0.3.0
  - @onerepo/file@0.2.0
  - @onerepo/builders@0.1.1
  - @onerepo/git@0.1.1
  - @onerepo/subprocess@0.2.1
  - @onerepo/yargs@0.1.2

## 0.3.0

### Minor Changes

- Support optional `nameFormat` and `dirnameFormat` for generate config [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

### Patch Changes

- Support dotfiles when running generate [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

## 0.2.1

### Patch Changes

- Fixes issue with `install` not completing due to missing tab-completions. [#152](https://github.com/paularmstrong/onerepo/pull/152) ([@paularmstrong](https://github.com/paularmstrong))

- When the working directory is a workspace and the user prompts for `--help`, an error would be thrown looking for the `subcommandDir` if it did not exist. We now check for the existence of said directory before attempting to add commands to the yargs app, preventing throwing an error during help generation. [#149](https://github.com/paularmstrong/onerepo/pull/149) ([@paularmstrong](https://github.com/paularmstrong))

- Updates to `glob@9` during workspace and file globbing operations. [#145](https://github.com/paularmstrong/onerepo/pull/145) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136), [`248af36`](https://github.com/paularmstrong/onerepo/commit/248af36e324824ec9587190e73ea7fe03bc955f3)]:
  - @onerepo/graph@0.2.1
  - @onerepo/yargs@0.1.1

## 0.2.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/file@0.1.0
  - @onerepo/git@0.1.0
  - @onerepo/graph@0.2.0
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0
  - @onerepo/yargs@0.1.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1
  - @onerepo/git@0.0.3

## 0.1.1

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/file@0.0.2
  - @onerepo/git@0.0.2
  - @onerepo/graph@0.1.1
  - @onerepo/logger@0.0.2
  - @onerepo/yargs@0.0.2

## 0.1.0

### Minor Changes

- Moved `generate` to core command. [#91](https://github.com/paularmstrong/onerepo/pull/91) ([@paularmstrong](https://github.com/paularmstrong))

- Added `${workspaces}` as a replacement token for spreading the list of affected workspaces through to individual tasks. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Adds the ability to specify inquirer `prompts` in `.onegen.js` files for `one generate` workspace generation. Answers will be spread as variable input to the EJS templates. [#94](https://github.com/paularmstrong/onerepo/pull/94) ([@paularmstrong](https://github.com/paularmstrong))

- Allow passing arbitrary meta information from the Task configs to the output information when using `one tasks --list`. [#84](https://github.com/paularmstrong/onerepo/pull/84) ([@paularmstrong](https://github.com/paularmstrong))

- Added standard build lifecycles and enable automatically running `pre-` and `post-` prefixed lifecycles if not directly specified in the given lifecycle. Running `one tasks -c pre-commit` will still only run `pre-commit`, but `one tasks -c commit` will run all of `pre-commit`, `commit`, and `post-commit` tasks, in order. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- It is now possible to pass a list of workspaces through to the `tasks` command to disregard the affected workspace calculation from `git` modified files. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Adds the ability to validate JSON files (like `package.json` and `tsconfig.json`) to ensure conformity across workspaces. This uses [AJV](https://ajv.js.org) with support for JSON schemas draft-2019-09 and draft-07. It also supports [ajv-errors](https://ajv.js.org/packages/ajv-errors.html) for better and more actionable error messaging. [#46](https://github.com/paularmstrong/onerepo/pull/46) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `.changesets/*` to the default list of ignored files [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Task matchers will fully add or remove a task from a lifecycle run if their globs are matched or not. This makes them a bit more powerful, but may cause a little more confusion at the same time: [#89](https://github.com/paularmstrong/onerepo/pull/89) ([@paularmstrong](https://github.com/paularmstrong))

  - If a task matcher does not match any of the modified files, the task will not run, despite the workspace tasks being triggered if other files in the workspace (or the root) were modified.
  - If a task matcher matches a path using relative matching outside of its workspace, eg, `match: '../other-module/**/*.ts'`, the task will be added to the run despite the workspace _not_ being modified.

- Moved worktree determination to before initial yargs building to ensure graph is working from the worktree instead of the main repo root. [#49](https://github.com/paularmstrong/onerepo/pull/49) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Change internal minimatch usage to use default export. [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure when requesting `sudo` permissions that output is clear and gives enough context. [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`4f7433d`](https://github.com/paularmstrong/onerepo/commit/4f7433d9f8d6ee12d90a557d7639a8b2bf0c8b1f), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a), [`0a3bb03`](https://github.com/paularmstrong/onerepo/commit/0a3bb03d0e33b2ac9505d43d9a2f0b87443e88f1), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b)]:
  - @onerepo/logger@0.0.1
  - @onerepo/yargs@0.0.1
  - @onerepo/subprocess@0.0.1
  - @onerepo/graph@0.1.0
  - @onerepo/git@0.0.1
  - @onerepo/file@0.0.1
