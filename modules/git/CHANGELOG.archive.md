# @onerepo/git

## 1.0.0

### Dependencies updated

- @onerepo/graph@1.0.0
- @onerepo/package-manager@1.0.0
- @onerepo/subprocess@1.0.0
- @onerepo/file@1.0.0
- @onerepo/logger@1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

### Patch changes

- Minor Typedoc updates ([fd80042](https://github.com/paularmstrong/onerepo/commit/fd80042f9db9c226908270a8d3524dd0f451cc85))

### Dependencies updated

- @onerepo/graph@1.0.0-beta.3
- @onerepo/package-manager@1.0.0-beta.3
- @onerepo/subprocess@1.0.0-beta.3
- @onerepo/file@1.0.0-beta.3
- @onerepo/logger@1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

### Dependencies updated

- @onerepo/graph@1.0.0-beta.2
- @onerepo/package-manager@1.0.0-beta.2
- @onerepo/subprocess@1.0.0-beta.2
- @onerepo/file@1.0.0-beta.2
- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Minor changes

- `updateIndex()` requires either passing the option `immediately: true` or calling `flushUpdateIndex()` afterwards in order to actually write to the git index. ([876e3e7](https://github.com/paularmstrong/onerepo/commit/876e3e71b64390472a3b91f2f554085b29ad2dd5))
  This process is designed to avoid race conditions from parallel calls which could cause git to become in a bad state, requiring users manually delete their `.git/index.lock` file.

### Dependencies updated

- @onerepo/graph@1.0.0-beta.1
- @onerepo/package-manager@1.0.0-beta.1
- @onerepo/subprocess@1.0.0-beta.1
- @onerepo/file@1.0.0-beta.1
- @onerepo/logger@1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

### Dependencies updated

- @onerepo/graph@1.0.0-beta.0
- @onerepo/package-manager@1.0.0-beta.0
- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/file@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.5.1

### Dependencies updated

- @onerepo/graph@0.11.0
- @onerepo/package-manager@0.5.1
- @onerepo/subprocess@0.7.1
- @onerepo/file@0.7.0
- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.5.0

### Minor Changes

- Environment variable prefixes have been changed from `ONE_REPO_` to `ONEREPO_` for consistency. [#559](https://github.com/paularmstrong/onerepo/pull/559) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix `updateIndex` log step wrapper/output. [#516](https://github.com/paularmstrong/onerepo/pull/516) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`19049eb`](https://github.com/paularmstrong/onerepo/commit/19049ebd60f965c4ab8bdc16045ce2112ae35fc1), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`0de22b4`](https://github.com/paularmstrong/onerepo/commit/0de22b4cd25911794975cedb709e5c378c3982ae), [`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c)]:
  - @onerepo/file@0.6.0
  - @onerepo/subprocess@0.7.0
  - @onerepo/logger@0.6.0

## 0.4.4

### Patch Changes

- Do not force checkout files if there are no partially staged files during task runs that use the git staging workflow. [#503](https://github.com/paularmstrong/onerepo/pull/503) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.3

### Patch Changes

- Apply unstaged changes using a better merge strategy from the stash to ensure that even in the event of conflicts, the stash is applied before being dropped. [#501](https://github.com/paularmstrong/onerepo/pull/501) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.2

### Patch Changes

- When running git staging workflow (eg, during `tasks -c pre-commit`), forcibly skip all git hooks, not just using HUSKY environment variables. [#499](https://github.com/paularmstrong/onerepo/pull/499) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.1

### Patch Changes

- Ensure Husky hooks are skipped during git checkout [#497](https://github.com/paularmstrong/onerepo/pull/497) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.0

### Minor Changes

- Added `StagingWorkflow` to save/stash & restore unstaged files and changes. [#476](https://github.com/paularmstrong/onerepo/pull/476) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149)]:
  - @onerepo/logger@0.5.0
  - @onerepo/subprocess@0.6.0
  - @onerepo/file@0.5.2

## 0.3.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1
  - @onerepo/subprocess@0.5.1

## 0.3.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/subprocess@0.5.0

## 0.2.3

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/subprocess@0.4.0

## 0.2.2

### Patch Changes

- Gracefully handle git merge-base lookups when the `--fork-point` becomes lost due to `git gc` [#295](https://github.com/paularmstrong/onerepo/pull/295) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/logger@0.2.1
  - @onerepo/subprocess@0.3.1

## 0.2.0

### Minor Changes

- `git.getStatus()` has been removed in favor of `git.isClean()` and `git.getModifiedFiles` [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

- `git.getModifiedFiles` will only return a list of files that have been modified – it is no longer a mapping of modification type. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- When getting modified files (`git.getModifiedFiles()` or HandlerExtra's `getFilepaths()`), only return the staged files if in a state with modified files. This prevents running `eslint`, `prettier`, and others across uncommitted files, especially in git `pre-commit` hooks. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b)]:
  - @onerepo/logger@0.2.0
  - @onerepo/subprocess@0.3.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/subprocess@0.2.1

## 0.1.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1

## 0.0.2

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/logger@0.0.2

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- When looking for modified files, merge the current status along with the diff-tree from merge-base. This mostly affects plugin-changesets when running `changsets add` in that adding multiple changesets in a single command will continue to show all affected workspaces each time, regardless of uncommitted status. [#62](https://github.com/paularmstrong/onerepo/pull/62) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc)]:
  - @onerepo/logger@0.0.1
  - @onerepo/subprocess@0.0.1
