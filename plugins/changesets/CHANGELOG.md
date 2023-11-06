# @onerepo/plugin-changesets

## 0.9.1

### Patch Changes

- Internal fixes for changeset's inappropriate esm exports. [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1
  - @onerepo/builders@0.5.0
  - @onerepo/file@0.5.1
  - @onerepo/git@0.3.1
  - @onerepo/graph@0.9.1
  - @onerepo/subprocess@0.5.1

## 0.9.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Important output information for prerelease and publish will be output as INFO instead of WARN logs [#423](https://github.com/paularmstrong/onerepo/pull/423) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/builders@0.4.0
  - @onerepo/file@0.5.0
  - @onerepo/git@0.3.0
  - @onerepo/graph@0.9.0
  - @onerepo/subprocess@0.5.0

## 0.8.4

### Patch Changes

- Attempt to recover from JSON parsing issues when determining publishable modules. [#399](https://github.com/paularmstrong/onerepo/pull/399) ([@paularmstrong](https://github.com/paularmstrong))

- Made running third-party executables more resilient to package manager exclusions. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`ebd9cfe`](https://github.com/paularmstrong/onerepo/commit/ebd9cfea826e17830d7878bec6a46a9a42e975d7)]:
  - @onerepo/graph@0.8.0
  - @onerepo/file@0.4.1

## 0.8.3

### Patch Changes

- Adjustments for using `logger` from the `HandlerExtras`. Commands no longer throw or return incorrectly when there are errors. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated `@changesets` underlying dependencies [`3cb7b81`](https://github.com/paularmstrong/onerepo/commit/3cb7b81b347b8936d61be32aca0c6f454eb8633e) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`772a27d`](https://github.com/paularmstrong/onerepo/commit/772a27d1e4f97565bb7d568b3e063b14733c29f7), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/subprocess@0.4.0
  - @onerepo/builders@0.3.0
  - @onerepo/file@0.4.0
  - @onerepo/git@0.2.3
  - @onerepo/graph@0.7.1

## 0.8.2

### Patch Changes

- Updated dependencies [[`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646), [`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646)]:
  - @onerepo/graph@0.7.0

## 0.8.1

### Patch Changes

- Updated dependencies [[`7250772`](https://github.com/paularmstrong/onerepo/commit/72507722769e0f6a29acbab90b13ec495d4dea1f)]:
  - @onerepo/git@0.2.2
  - @onerepo/builders@0.2.2

## 0.8.0

### Minor Changes

- Add validation to input prompts when adding new changesets to ensure at least one workspace is added and a changeset entry is content. [#263](https://github.com/paularmstrong/onerepo/pull/263) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/builders@0.2.1
  - @onerepo/file@0.3.1
  - @onerepo/git@0.2.1
  - @onerepo/graph@0.6.1
  - @onerepo/logger@0.2.1
  - @onerepo/subprocess@0.3.1

## 0.7.0

### Minor Changes

- Allow selecting unmodified workspaces in `changeset add` through a `More…` option. [#253](https://github.com/paularmstrong/onerepo/pull/253) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- When versioning packages, only production dependencies will be versioned, even if dev dependencies have changes. This should be safe because `devDependencies` are explicitly stripped out during publish. [#241](https://github.com/paularmstrong/onerepo/pull/241) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`9004117`](https://github.com/paularmstrong/onerepo/commit/900411775b115763adc383e328b77f7d24ae6209), [`d88f906`](https://github.com/paularmstrong/onerepo/commit/d88f906381b729f052f347d6b7ebcec9bf6a24cc)]:
  - @onerepo/graph@0.6.0

## 0.6.1

### Patch Changes

- Fix critical error thrown by changesets when attempting to version and publish. Related upstream issue: [changesets/changesets#622](https://github.com/changesets/changesets/issues/622). [#231](https://github.com/paularmstrong/onerepo/pull/231) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/graph@0.5.0

## 0.6.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- When getting publishable packages from the registry, missing packages would respond with an error and prevent subsequent packages from being determined, resulting in some new packages not being marked as publishable. [#218](https://github.com/paularmstrong/onerepo/pull/218) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- More accurately determines the list of publishable workspaces. [#216](https://github.com/paularmstrong/onerepo/pull/216) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`687583e`](https://github.com/paularmstrong/onerepo/commit/687583ed707e875f7941f77192528865ab77ae35)]:
  - @onerepo/builders@0.2.0
  - @onerepo/file@0.3.0
  - @onerepo/git@0.2.0
  - @onerepo/graph@0.4.0
  - @onerepo/logger@0.2.0
  - @onerepo/subprocess@0.3.0

## 0.5.0

### Minor Changes

- When running `changesets version`, the package manager’s `install` command will be run before exiting and the updated lockfile will be added to the git index when `--add` is `true` (default). [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

- Removed the `--package-manager` option from `changesets prerelease` and `changesets publish` commands. The package manager is now inferred by the repository Graph automatically. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Uses `@onerepo/package-manager` to handle publish & prerelease tasks. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

- Speeds up publish/pre-release by not building affected workspaces. [#182](https://github.com/paularmstrong/onerepo/pull/182) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures `access` is set according to the first publishable workspace when publishing. [`9ea7d2b`](https://github.com/paularmstrong/onerepo/commit/9ea7d2b988184b8255797096270c0ca7ecd2985f) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`ac93c89`](https://github.com/paularmstrong/onerepo/commit/ac93c898da6d59ee3e161b27e17c4785c28b1b39), [`68018fe`](https://github.com/paularmstrong/onerepo/commit/68018fe439e6ce7bbbd12c71d8662779692a66d4), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/graph@0.3.0
  - @onerepo/file@0.2.0
  - @onerepo/builders@0.1.1
  - @onerepo/git@0.1.1
  - @onerepo/subprocess@0.2.1

## 0.4.1

### Patch Changes

- Updated dependencies [[`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136)]:
  - @onerepo/graph@0.2.1

## 0.4.0

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

## 0.3.0

### Minor Changes

- Must manually specify package manager with changesets publishing because yarn npm publish can differ greatly in unexpected ways depending on your registry [#139](https://github.com/paularmstrong/onerepo/pull/139) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.1

### Patch Changes

- When applying a `publishConfig`, retain the `registry` if it exists. [`34704c5`](https://github.com/paularmstrong/onerepo/commit/34704c57af16fd24885dd9aa4fbfdea0b1545bb6) ([@paularmstrong](https://github.com/paularmstrong))

- When using yarn, ensure fully using yarn for `npm info`, `npm whoami` and `npm publish`. [`34704c5`](https://github.com/paularmstrong/onerepo/commit/34704c57af16fd24885dd9aa4fbfdea0b1545bb6) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.0

### Minor Changes

- Allow skipping the NPM registry `whoami` check with `--skip-auth` during `publish`. [#137](https://github.com/paularmstrong/onerepo/pull/137) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.2

### Patch Changes

- When publishing a module for the first time, `npm info` version lookup will fail. We will now gracefully handle this and assume it should be published. [#135](https://github.com/paularmstrong/onerepo/pull/135) ([@paularmstrong](https://github.com/paularmstrong))

- Use `yarn npm info` if working in a repository that uses Yarn when determining workspaces needing publish. This is necessary in case there are custom registries set up in the `.yarnrc.yml` either globally or scoped – otherwise the correct authentication method won't be used and the result could either always return E404 (package does not exist) or 401 auth error. [#136](https://github.com/paularmstrong/onerepo/pull/136) ([@paularmstrong](https://github.com/paularmstrong))

- When listing modified workspaces for pre-release, ensure they are actually able to be chosen and released. [#136](https://github.com/paularmstrong/onerepo/pull/136) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1

## 0.1.1

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/file@0.0.2

## 0.1.0

### Minor Changes

- - Reorder main command name to priorities `change` and primary. [#73](https://github.com/paularmstrong/onerepo/pull/73) ([@paularmstrong](https://github.com/paularmstrong))
  - Adds singular `changeset` to command aliases.
  - Rename `prepare` to `version`.

- Remove `--update-index` alias from `add` and `version` command option `--add`. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning workspaces for publishing, ensure the git working state is clean without changes. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- `prerelease` and `publish` will now run the standard `tasks` lifecycle `build` with the list of publishable workspaces. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Add the new changeset to the git stage by default when running `changeset add`. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- Automatically add updated `package.json` and `CHANGELOG.md` files to the git index when versioning. [#80](https://github.com/paularmstrong/onerepo/pull/80) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Carry publishConfig.access over to NPM publish arguments to avoid access errors. [#103](https://github.com/paularmstrong/onerepo/pull/103) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning a workspace based on changesets, also forcefully select _dependencies_ and apply their changesets as well. This fixes a behavior where the _affected_ workspaces were selected, which is the opposite behavior we actually wanted here. [#80](https://github.com/paularmstrong/onerepo/pull/80) ([@paularmstrong](https://github.com/paularmstrong))

- Init must call `changeset` not `changesets` bin [#107](https://github.com/paularmstrong/onerepo/pull/107) ([@paularmstrong](https://github.com/paularmstrong))

- Don't attempt to build & publish during `changesets publish` if there are no publishable workspaces. [#129](https://github.com/paularmstrong/onerepo/pull/129) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning workspaces, check for other workspaces not in the list of those selected for release. If there are more that need to be added outside of the direct dependency chain, warn the user and confirm okay to continue including those workspaces as well. [#119](https://github.com/paularmstrong/onerepo/pull/119) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Only add the expected files and filter out changelots on private workspaces to prevent git updateIndex from throwing an error. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- When looking for modified files, merge the current status along with the diff-tree from merge-base. This mostly affects plugin-changesets when running `changsets add` in that adding multiple changesets in a single command will continue to show all affected workspaces each time, regardless of uncommitted status. [#62](https://github.com/paularmstrong/onerepo/pull/62) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure prepare includes the changesets in the releasePlan, otherwise nothing will be assembled for applying. [#48](https://github.com/paularmstrong/onerepo/pull/48) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b)]:
  - @onerepo/subprocess@0.0.1
  - @onerepo/file@0.0.1
