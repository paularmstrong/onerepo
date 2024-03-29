# @onerepo/package-manager

## 1.0.0

### Dependencies updated

- @onerepo/subprocess@1.0.0
- @onerepo/logger@1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

### Dependencies updated

- @onerepo/subprocess@1.0.0-beta.3
- @onerepo/logger@1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

### Dependencies updated

- @onerepo/subprocess@1.0.0-beta.2
- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Patch changes

- Type documentation updates ([0ef3a1b](https://github.com/paularmstrong/onerepo/commit/0ef3a1b414c3a34aaaab8d7a6400bb36430be152))
- Prevents auto-adding `latest` as the dist-tag when publishing workspaces when their versions have pre-release suffixes. ([483d7c0](https://github.com/paularmstrong/onerepo/commit/483d7c000ca69f094a43797f05e8f0432e2a5d70))

### Dependencies updated

- @onerepo/subprocess@1.0.0-beta.1
- @onerepo/logger@1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

### Dependencies updated

- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.5.1

### Dependencies updated

- @onerepo/subprocess@0.7.1
- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.5.0

### Minor Changes

- Potentially speed up package manager determination by using the `npm_config_user_agent` environment variable. [#510](https://github.com/paularmstrong/onerepo/pull/510) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c)]:
  - @onerepo/subprocess@0.7.0

## 0.4.2

### Patch Changes

- Updated dependencies [[`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d)]:
  - @onerepo/subprocess@0.6.0

## 0.4.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/subprocess@0.5.1

## 0.4.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/subprocess@0.5.0

## 0.3.0

### Minor Changes

- Added `packageManager.batch` for batching third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Added `packageManager.run` for running third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Attempt to recover from JSON parsing issues when determining publishable modules. [#399](https://github.com/paularmstrong/onerepo/pull/399) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.3

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840)]:
  - @onerepo/subprocess@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/subprocess@0.3.1

## 0.2.1

### Patch Changes

- Fixes PNPm lookup for `pnpm-lock.yaml` files. [#220](https://github.com/paularmstrong/onerepo/pull/220) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.0

### Minor Changes

- `install` now accepts a working directory argument. [#214](https://github.com/paularmstrong/onerepo/pull/214) ([@paularmstrong](https://github.com/paularmstrong))

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- When getting publishable packages from the registry, missing packages would respond with an error and prevent subsequent packages from being determined, resulting in some new packages not being marked as publishable. [#218](https://github.com/paularmstrong/onerepo/pull/218) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- More accurately determines the list of publishable workspaces. [#216](https://github.com/paularmstrong/onerepo/pull/216) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b)]:
  - @onerepo/subprocess@0.3.0

## 0.1.0

### Minor Changes

- `await manager.install()` will now return the resulting lockfile that updates as a result of the package manager’s process. [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Initial release. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies []:
  - @onerepo/subprocess@0.2.1

## 0.1.0

### Minor Changes

- `await manager.install()` will now return the resulting lockfile that updates as a result of the package manager’s process. [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Initial release. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies []:
  - @onerepo/subprocess@0.2.1
