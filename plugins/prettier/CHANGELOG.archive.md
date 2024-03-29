# @onerepo/plugin-prettier

## 1.0.0

### Dependencies updated

- onerepo@1.0.0
- @onerepo/test-cli@1.0.0
- @onerepo/yargs@1.0.0
- @onerepo/builders@1.0.0
- @onerepo/git@1.0.0
- @onerepo/graph@1.0.0
- @onerepo/package-manager@1.0.0
- @onerepo/subprocess@1.0.0
- @onerepo/file@1.0.0
- @onerepo/logger@1.0.0

> View the full changelog: [3422ce3...99a9330](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.2

### Dependencies updated

- onerepo@1.0.0-beta.2
- @onerepo/test-cli@1.0.0-beta.2
- @onerepo/yargs@1.0.0-beta.2
- @onerepo/builders@1.0.0-beta.2
- @onerepo/git@1.0.0-beta.2
- @onerepo/graph@1.0.0-beta.2
- @onerepo/package-manager@1.0.0-beta.2
- @onerepo/subprocess@1.0.0-beta.2
- @onerepo/file@1.0.0-beta.2
- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Minor changes

- When running [`docgen`](https://onerepo.tools/plugins/docgen/), only default configuration options will be used. ([5e1d3c3](https://github.com/paularmstrong/onerepo/commit/5e1d3c34a2e0a08ee38a5e81d6d392178af3631c))
- Adds `format` as a default command alias. ([5e1d3c3](https://github.com/paularmstrong/onerepo/commit/5e1d3c34a2e0a08ee38a5e81d6d392178af3631c))

### Patch changes

- Updated oneRepo dependencies to pin as a peer to the appropriate oneRepo release instead of internal sub-packages. ([92e1441](https://github.com/paularmstrong/onerepo/commit/92e14416aebaf47d21fe7cbcba625f6d48a9b001))
- Minor documentation updates ([ae36512](https://github.com/paularmstrong/onerepo/commit/ae36512f3994d599f08fd834aebfa81029c17e39))

### Dependencies updated

- onerepo@1.0.0-beta.1
- @onerepo/test-cli@1.0.0-beta.1
- @onerepo/yargs@1.0.0-beta.1
- @onerepo/builders@1.0.0-beta.1
- @onerepo/git@1.0.0-beta.1
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

- onerepo@1.0.0-beta.0
- @onerepo/test-cli@1.0.0-beta.0
- @onerepo/yargs@1.0.0-beta.0
- @onerepo/builders@1.0.0-beta.0
- @onerepo/git@1.0.0-beta.0
- @onerepo/graph@1.0.0-beta.0
- @onerepo/package-manager@1.0.0-beta.0
- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/file@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.6.1

### Patch changes

- Correct CLI usage syntax in `--help` output. ([569a10e](https://github.com/paularmstrong/onerepo/commit/569a10e5678f280224bdc03fbc38b37fdaa096a5))

### Dependencies updated

- onerepo@0.17.0
- @onerepo/test-cli@0.5.7
- @onerepo/yargs@0.7.0
- @onerepo/builders@0.5.7
- @onerepo/git@0.5.1
- @onerepo/graph@0.11.0
- @onerepo/package-manager@0.5.1
- @onerepo/subprocess@0.7.1
- @onerepo/file@0.7.0
- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.6.0

### Minor Changes

- Enable using cache to speed up formatting files. This feature can be disabled at the plugin configuration level by setting `useCache: false` or by passing `--no-cache` to the command. [#511](https://github.com/paularmstrong/onerepo/pull/511) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix package.json homepage URLs. [#561](https://github.com/paularmstrong/onerepo/pull/561) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`19049eb`](https://github.com/paularmstrong/onerepo/commit/19049ebd60f965c4ab8bdc16045ce2112ae35fc1), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`0de22b4`](https://github.com/paularmstrong/onerepo/commit/0de22b4cd25911794975cedb709e5c378c3982ae), [`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`9dea7b0`](https://github.com/paularmstrong/onerepo/commit/9dea7b02ba2c8257714ae1b9d4235a0f7e5a0b75)]:
  - @onerepo/file@0.6.0
  - @onerepo/subprocess@0.7.0
  - @onerepo/logger@0.6.0
  - @onerepo/git@0.5.0
  - @onerepo/builders@0.5.6

## 0.5.6

### Patch Changes

- Updated dependencies [[`fe49360`](https://github.com/paularmstrong/onerepo/commit/fe493603a99ee53c72c2785c6d7f316e9a0ba5e9)]:
  - @onerepo/git@0.4.4
  - @onerepo/builders@0.5.5

## 0.5.5

### Patch Changes

- Updated dependencies [[`6b30e32`](https://github.com/paularmstrong/onerepo/commit/6b30e32f3b52a7546ab210d3c3aec8bb2b166b61)]:
  - @onerepo/git@0.4.3
  - @onerepo/builders@0.5.4

## 0.5.4

### Patch Changes

- Updated dependencies [[`5a6faab`](https://github.com/paularmstrong/onerepo/commit/5a6faabc9ef4281d206315a5bc60b50b51a476c2)]:
  - @onerepo/git@0.4.2
  - @onerepo/builders@0.5.3

## 0.5.3

### Patch Changes

- Updated dependencies [[`0f3535a`](https://github.com/paularmstrong/onerepo/commit/0f3535a3d5302ebf7ac21f96325a6018add6acbd)]:
  - @onerepo/git@0.4.1
  - @onerepo/builders@0.5.2

## 0.5.2

### Patch Changes

- Updated dependencies [[`3051ff2`](https://github.com/paularmstrong/onerepo/commit/3051ff25acc04a14343b48ae23f14a1ef3cf3326), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149)]:
  - @onerepo/git@0.4.0
  - @onerepo/logger@0.5.0
  - @onerepo/subprocess@0.6.0
  - @onerepo/builders@0.5.1
  - @onerepo/file@0.5.2

## 0.5.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1
  - @onerepo/builders@0.5.0
  - @onerepo/file@0.5.1
  - @onerepo/git@0.3.1
  - @onerepo/subprocess@0.5.1

## 0.5.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/builders@0.4.0
  - @onerepo/file@0.5.0
  - @onerepo/git@0.3.0
  - @onerepo/subprocess@0.5.0

## 0.4.1

### Patch Changes

- Made running third-party executables more resilient to package manager exclusions. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`ebd9cfe`](https://github.com/paularmstrong/onerepo/commit/ebd9cfea826e17830d7878bec6a46a9a42e975d7)]:
  - @onerepo/file@0.4.1

## 0.4.0

### Minor Changes

- Adds better formatting and context for prettier formatting errors when run with `--check`. Also includes GitHub annotations when run in GH Actions. [#345](https://github.com/paularmstrong/onerepo/pull/345) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Supports Prettier ^3 (still supports ^2). [#373](https://github.com/paularmstrong/onerepo/pull/373) ([@paularmstrong](https://github.com/paularmstrong))

- Adjustments for using `logger` from the `HandlerExtras`. Commands no longer throw or return incorrectly when there are errors. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Fix config key: `annotateGithub` ➡️ `githubAnnotate` [#346](https://github.com/paularmstrong/onerepo/pull/346) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`772a27d`](https://github.com/paularmstrong/onerepo/commit/772a27d1e4f97565bb7d568b3e063b14733c29f7), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/subprocess@0.4.0
  - @onerepo/builders@0.3.0
  - @onerepo/file@0.4.0
  - @onerepo/git@0.2.3

## 0.3.2

### Patch Changes

- Updated dependencies [[`7250772`](https://github.com/paularmstrong/onerepo/commit/72507722769e0f6a29acbab90b13ec495d4dea1f)]:
  - @onerepo/git@0.2.2
  - @onerepo/builders@0.2.2

## 0.3.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/builders@0.2.1
  - @onerepo/file@0.3.1
  - @onerepo/git@0.2.1
  - @onerepo/logger@0.2.1
  - @onerepo/subprocess@0.3.1

## 0.3.0

### Minor Changes

- When using `--add`, `--staged` is automatically implied as `true`. Only files that are part of the git stage will be operated on and re-added to the git stage. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Fixes some log output with steps not being grouped correctly. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`687583e`](https://github.com/paularmstrong/onerepo/commit/687583ed707e875f7941f77192528865ab77ae35)]:
  - @onerepo/builders@0.2.0
  - @onerepo/file@0.3.0
  - @onerepo/git@0.2.0
  - @onerepo/logger@0.2.0
  - @onerepo/subprocess@0.3.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`ac93c89`](https://github.com/paularmstrong/onerepo/commit/ac93c898da6d59ee3e161b27e17c4785c28b1b39), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/file@0.2.0
  - @onerepo/builders@0.1.1
  - @onerepo/git@0.1.1
  - @onerepo/subprocess@0.2.1

## 0.2.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/file@0.1.0
  - @onerepo/git@0.1.0
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0

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
  - @onerepo/git@0.0.2
  - @onerepo/logger@0.0.2

## 0.1.0

### Minor Changes

- Respect .prettier files when formatting across files and paths (as opposed to `--all`) [#61](https://github.com/paularmstrong/onerepo/pull/61) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Change internal minimatch usage to use default export. [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`0a3bb03`](https://github.com/paularmstrong/onerepo/commit/0a3bb03d0e33b2ac9505d43d9a2f0b87443e88f1)]:
  - @onerepo/logger@0.0.1
  - @onerepo/subprocess@0.0.1
  - @onerepo/git@0.0.1
