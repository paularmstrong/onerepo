# @onerepo/core

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
