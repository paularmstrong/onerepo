# @onerepo/graph

## 1.0.0

### Dependencies updated

- @onerepo/package-manager@1.0.0
- @onerepo/subprocess@1.0.0
- @onerepo/logger@1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

### Patch changes

- Incorrect reading and writing `pnpm-workspace.yaml` files ([141772b](https://github.com/paularmstrong/onerepo/commit/141772b8f42c43db72a9ab2c1b58168bc7557a33))

### Dependencies updated

- @onerepo/package-manager@1.0.0-beta.3
- @onerepo/subprocess@1.0.0-beta.3
- @onerepo/logger@1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

### Dependencies updated

- @onerepo/package-manager@1.0.0-beta.2
- @onerepo/subprocess@1.0.0-beta.2
- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Dependencies updated

- @onerepo/package-manager@1.0.0-beta.1
- @onerepo/subprocess@1.0.0-beta.1
- @onerepo/logger@1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

### Dependencies updated

- @onerepo/package-manager@1.0.0-beta.0
- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.11.0

### Minor changes

- Refactored internals for applying `package.json` `publishConfig` entries. Use `workspace.publishablePackageJson` to get a safe version of the Workspace's `package.json` file, ready for publishing. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))

### Dependencies updated

- @onerepo/package-manager@0.5.1
- @onerepo/subprocess@0.7.1
- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.10.0

### Minor Changes

- Switched runtime from `esbuild-register` to `jiti` to avoid heavy dependencies and platform-specific requirements. [#513](https://github.com/paularmstrong/onerepo/pull/513) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`154a2d1`](https://github.com/paularmstrong/onerepo/commit/154a2d151012f0c0c31831ab3ecab32ef6dc45ef)]:
  - @onerepo/package-manager@0.5.0

## 0.9.3

### Patch Changes

- Changed from using a TS-specific enum for DependencyType to a plain object. Should prevent oddities with TS integrations and building. [#504](https://github.com/paularmstrong/onerepo/pull/504) ([@paularmstrong](https://github.com/paularmstrong))

## 0.9.2

### Patch Changes

- Updated dependencies []:
  - @onerepo/package-manager@0.4.2

## 0.9.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/package-manager@0.4.1

## 0.9.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093)]:
  - @onerepo/package-manager@0.4.0

## 0.8.0

### Minor Changes

- Added `packageManager.batch` for batching third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Added `packageManager.run` for running third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`71a61cf`](https://github.com/paularmstrong/onerepo/commit/71a61cf1582f1eee5d9cd16a6bf52de014c6cce5), [`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff)]:
  - @onerepo/package-manager@0.3.0

## 0.7.1

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840)]:
  - @onerepo/package-manager@0.2.3

## 0.7.0

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

## 0.6.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/package-manager@0.2.2

## 0.6.0

### Minor Changes

- Adds dependency and dependent filtering option with `DependencyType` enum. [#241](https://github.com/paularmstrong/onerepo/pull/241) ([@paularmstrong](https://github.com/paularmstrong))

  Example: grab only production dependent workspaces:

  ```ts
  graph.dependents(myWorkspace, true, DependencyType.PROD);
  ```

- Task `match` can now be an array of glob strings. [#254](https://github.com/paularmstrong/onerepo/pull/254) ([@paularmstrong](https://github.com/paularmstrong))

## 0.5.0

### Minor Changes

- Adds PNPm support. [#220](https://github.com/paularmstrong/onerepo/pull/220) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/package-manager@0.2.1

## 0.4.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`434f113`](https://github.com/paularmstrong/onerepo/commit/434f113be7d373ab5c14aa5e5e313201e4e00902), [`0fa0f63`](https://github.com/paularmstrong/onerepo/commit/0fa0f63e3eb6351489669953942c39c20910f881), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`0b97317`](https://github.com/paularmstrong/onerepo/commit/0b973175a0efdee303896de2a2713987527a8194)]:
  - @onerepo/package-manager@0.2.0

## 0.3.0

### Minor Changes

- Adds `graph.packageManager` to handle various common functions for interacting with the repository's package manager (Yarn, NPM, or PNPm), determining which to use automatically. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Prevent aliases from being reused across workspaces. [#161](https://github.com/paularmstrong/onerepo/pull/161) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985)]:
  - @onerepo/package-manager@0.1.0

## 0.2.1

### Patch Changes

- Updates to `glob@9` during workspace and file globbing operations. [#145](https://github.com/paularmstrong/onerepo/pull/145) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.1

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.0

### Minor Changes

- Adds the ability to get a graph-data-structure that is isolated to the set of input sources using `graph.isolatedGraph(sources)`. Useful for debugging and walking the `affected` graph, not just an array like is returned from `.affected()`. [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

  Adds standard isolation inputs to `one graph show` to limit the output to `--all`, `--affected`, or a set of `--workspaces`.

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))
