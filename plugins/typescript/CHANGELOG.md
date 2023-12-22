# @onerepo/plugin-typescript

## 0.4.0

### Minor Changes

- Adds support for TypeScript project references. Set `useProjectReferences: true` in the plugin configuration to get started. [#504](https://github.com/paularmstrong/onerepo/pull/504) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.5

## 0.3.5

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.4

## 0.3.4

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.3

## 0.3.3

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.2

## 0.3.2

### Patch Changes

- Updated dependencies [[`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d)]:
  - @onerepo/subprocess@0.6.0
  - @onerepo/builders@0.5.1

## 0.3.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/builders@0.5.0
  - @onerepo/subprocess@0.5.1

## 0.3.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/builders@0.4.0
  - @onerepo/subprocess@0.5.0

## 0.2.4

### Patch Changes

- Respect the `tsconfig` option when looking up workspaces to check. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Made running third-party executables more resilient to package manager exclusions. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.3

### Patch Changes

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43)]:
  - @onerepo/subprocess@0.4.0
  - @onerepo/builders@0.3.0

## 0.2.2

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/builders@0.2.1
  - @onerepo/subprocess@0.3.1

## 0.2.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Output is colored using TypeScript’s [`--pretty` flag](https://www.typescriptlang.org/tsconfig/#pretty) by default. Disable with `--no-pretty`. [#202](https://github.com/paularmstrong/onerepo/pull/202) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89)]:
  - @onerepo/builders@0.2.0
  - @onerepo/subprocess@0.3.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`9ebb136`](https://github.com/paularmstrong/onerepo/commit/9ebb1368e33e45a8ad56c92f5bb4110e305e54c3), [`be8b645`](https://github.com/paularmstrong/onerepo/commit/be8b645403399370d25aeb53d25067a03a968969), [`36acaa6`](https://github.com/paularmstrong/onerepo/commit/36acaa6e6a02a3f2fd5b7dcd08127b8fe7ac8398), [`c1827fe`](https://github.com/paularmstrong/onerepo/commit/c1827fe2232bdde970865aa0edaa391f929a0954), [`38836d8`](https://github.com/paularmstrong/onerepo/commit/38836d85df015c31470fd85a04f6ef014000afff), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`2fb7823`](https://github.com/paularmstrong/onerepo/commit/2fb7823fabee5baf9318b9a31b1288f68c4a3d35)]:
  - @onerepo/core@0.4.0
  - @onerepo/builders@0.1.1
  - @onerepo/subprocess@0.2.1

## 0.1.2

### Patch Changes

- Updated dependencies [[`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6), [`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6)]:
  - @onerepo/core@0.3.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`e279809`](https://github.com/paularmstrong/onerepo/commit/e279809fcac4be0fe3d7622f3d2c7cca70d568d2), [`54abe47`](https://github.com/paularmstrong/onerepo/commit/54abe47ebe1eae9c6e70ea344b099b05b63621e2), [`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136)]:
  - @onerepo/core@0.2.1

## 0.1.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/core@0.2.0
  - @onerepo/subprocess@0.2.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1
  - @onerepo/core@0.1.2

## 0.0.2

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/builders@0.0.2
  - @onerepo/core@0.1.1

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Change internal minimatch usage to use default export. [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c1863ba`](https://github.com/paularmstrong/onerepo/commit/c1863ba8a30455b6b43530a91b15c00cb1881052), [`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`d502f2e`](https://github.com/paularmstrong/onerepo/commit/d502f2effe7c3448bc0143020778744ca71c5b1e), [`6431e8d`](https://github.com/paularmstrong/onerepo/commit/6431e8d33cba1304c0e275ce1c8eac4265c742b2), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`587b442`](https://github.com/paularmstrong/onerepo/commit/587b4425863c88487794622c6da95a0c4f3559ae), [`1293372`](https://github.com/paularmstrong/onerepo/commit/12933720aad9024d278fa2097ac4fac8bdab81eb), [`4f7433d`](https://github.com/paularmstrong/onerepo/commit/4f7433d9f8d6ee12d90a557d7639a8b2bf0c8b1f), [`126c514`](https://github.com/paularmstrong/onerepo/commit/126c5147d0bb2c4ed5bca2973dbce1ae3133cc3e), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b)]:
  - @onerepo/core@0.1.0
  - @onerepo/subprocess@0.0.1
  - @onerepo/builders@0.0.1
