# @onerepo/core

## 0.9.0

### Minor Changes

- Added optional key `$required` to JSON schema validation via `graph verify` to mark files as required. If set to true and no files via the file glob are found in matching workspaces, an error will be logged and the command will fail. [#365](https://github.com/paularmstrong/onerepo/pull/365) ([@paularmstrong](https://github.com/paularmstrong))

- Overhauled performance logging. All marks are pairs that start with `onerepo_start_` and `onerepo_end_`. By default, these will be converted into [Node.js performance `measure` entries](https://nodejs.org/api/perf_hooks.html#class-performancemeasure) for use in your own telemetry implementation. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- No longer re-throws errors thrown from handlers. If an error is encountered, the process will still set the exit code (`1`), but will not crash the process to ensure cleanup and post-handlers are completed properly. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Allows custom schema validators for `graph verify` to be functions that return JSONSchema. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

  As a function, the schema accepts two arguments, `workspace` and `graph`:

  ```ts
  import type { graph } from 'onerepo';

  export default {
  	'**': {
  		'package.json': (workspace: graph.Workspace, graph: graph.Graph) => ({
  			type: 'object',
  			properties: {
  				repository: {
  					type: 'object',
  					properties: {
  						directory: { type: 'string', const: graph.root.relative(workspace.location) },
  					},
  					required: ['directory'],
  				},
  			},
  			required: ['repository'],
  		}),
  	},
  };
  ```

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adjustments for using `logger` from the `HandlerExtras`. Commands no longer throw or return incorrectly when there are errors. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Running `install` multiple times will no longer break tab-completions. [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

- Clarified usage of `logger` should be restricted to only the one that is given in `HandlerExtra` [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`772a27d`](https://github.com/paularmstrong/onerepo/commit/772a27d1e4f97565bb7d568b3e063b14733c29f7), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/subprocess@0.4.0
  - @onerepo/builders@0.3.0
  - @onerepo/file@0.4.0
  - @onerepo/git@0.2.3
  - @onerepo/graph@0.7.1
  - @onerepo/yargs@0.3.0

## 0.8.0

### Minor Changes

- Added ability to have _sequential_ steps within both `parallel` and `serial` tasks by providing arrays of steps. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

  ```js
  /** @type import('onerepo').graph.TaskConfig */
  export default {
  	'example-parallel': {
  		parallel: ['echo "run separately"', ['echo "first"', 'echo "second"']],
  	},
  	'example-serial': {
  		serial: [['echo "first"', 'echo "second"'], 'echo "run separately"'],
  	},
  	'example-serial-with-match': {
  		serial: [{ cmd: ['echo "first"', 'echo "second"'], match: './**/*' }, 'echo "run separately"'],
  	},
  };
  ```

- `sequential` has been renamed in Task configs to `serial` in order to differentiate between what _should_ be run separately to what _must_ be run in an ordered manner. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646), [`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646)]:
  - @onerepo/graph@0.7.0

## 0.7.2

### Patch Changes

- Updated dependencies [[`7250772`](https://github.com/paularmstrong/onerepo/commit/72507722769e0f6a29acbab90b13ec495d4dea1f)]:
  - @onerepo/git@0.2.2
  - @onerepo/builders@0.2.2
  - @onerepo/yargs@0.2.2

## 0.7.1

### Patch Changes

- Fix issue on install where husky doesn't install due to missing file [#284](https://github.com/paularmstrong/onerepo/pull/284) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/builders@0.2.1
  - @onerepo/file@0.3.1
  - @onerepo/git@0.2.1
  - @onerepo/graph@0.6.1
  - @onerepo/logger@0.2.1
  - @onerepo/subprocess@0.3.1
  - @onerepo/yargs@0.2.1

## 0.7.0

### Minor Changes

- Task `match` can now be an array of glob strings. [#254](https://github.com/paularmstrong/onerepo/pull/254) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`9004117`](https://github.com/paularmstrong/onerepo/commit/900411775b115763adc383e328b77f7d24ae6209), [`d88f906`](https://github.com/paularmstrong/onerepo/commit/d88f906381b729f052f347d6b7ebcec9bf6a24cc)]:
  - @onerepo/graph@0.6.0

## 0.6.1

### Patch Changes

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/graph@0.5.0

## 0.6.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `name` and `description` options to template generation configs. [#201](https://github.com/paularmstrong/onerepo/pull/201) ([@paularmstrong](https://github.com/paularmstrong))

  ```js title=".onegen.js"
  export default {
  	name: 'Module',
  	description: 'A description for the module to generate',
  	prompts: [],
  };
  ```

  ```
   ┌ Get template
   └ ⠙
  ? Choose a template… (Use arrow keys)
  ❯ Command - Create a repo-local command
    Module - Create a shared workspace in modules/
    Plugin - Create a publishable oneRepo plugin
  ```

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures that `devDependencies` and `peerDependencies` are checked for semantic version intersections when running `graph verify`. [#215](https://github.com/paularmstrong/onerepo/pull/215) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`687583e`](https://github.com/paularmstrong/onerepo/commit/687583ed707e875f7941f77192528865ab77ae35)]:
  - @onerepo/builders@0.2.0
  - @onerepo/file@0.3.0
  - @onerepo/git@0.2.0
  - @onerepo/graph@0.4.0
  - @onerepo/logger@0.2.0
  - @onerepo/subprocess@0.3.0
  - @onerepo/yargs@0.2.0

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
