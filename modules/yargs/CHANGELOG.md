# @onerepo/yargs

## 1.0.0-beta.1

### Dependencies updated

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

### Patch changes

- Dev dependency updates ([a96e6d5](https://github.com/paularmstrong/onerepo/commit/a96e6d552678239ea4b82b39130a002329b256d5))
- Updated internal types dependencies. ([de04ab8](https://github.com/paularmstrong/onerepo/commit/de04ab877c4e04f43ada5383a89c040f678475a2))
- Minor typedoc fixes ([596d9f2](https://github.com/paularmstrong/onerepo/commit/596d9f2ed3878e7c8f872bdabf6c3a3c248e94fa))

### Dependencies updated

- @onerepo/builders@1.0.0-beta.0
- @onerepo/git@1.0.0-beta.0
- @onerepo/graph@1.0.0-beta.0
- @onerepo/package-manager@1.0.0-beta.0
- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/file@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.7.0

### Minor changes

- Recommend possible commands when command is not found (for typos, etc). ([490d919](https://github.com/paularmstrong/onerepo/commit/490d919c51cc4353a8201813346a5bfe1cfaf357))
- Replaced the `--silent` flag with `--quiet`/`-q` for consistency across other CLIs. ([25f5d48](https://github.com/paularmstrong/onerepo/commit/25f5d48b56d46f5f9b83ada2c582d5ec2589b9ee))

### Patch changes

- Correct CLI usage syntax in `--help` output. ([569a10e](https://github.com/paularmstrong/onerepo/commit/569a10e5678f280224bdc03fbc38b37fdaa096a5))

### Dependencies updated

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

- Added engines check to verify current node.js version with the range defined in the repo's root package.json. [`4c67f8b`](https://github.com/paularmstrong/onerepo/commit/4c67f8ba789f8bc79ea6962b1cd08c8c8f7305f4) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c)]:
  - @onerepo/subprocess@0.7.0
  - @onerepo/logger@0.6.0
  - @onerepo/builders@0.5.6

## 0.5.6

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.5

## 0.5.5

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.4

## 0.5.4

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.3

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.2

## 0.5.2

### Patch Changes

- Worked around a bug in Yargs that prevented `--show-advanced` from showing hidden/advanced help documentation when used on sub-commands. [#447](https://github.com/paularmstrong/onerepo/pull/447) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149)]:
  - @onerepo/logger@0.5.0
  - @onerepo/subprocess@0.6.0
  - @onerepo/builders@0.5.1

## 0.5.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1
  - @onerepo/builders@0.5.0
  - @onerepo/subprocess@0.5.1

## 0.5.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/builders@0.4.0
  - @onerepo/subprocess@0.5.0

## 0.4.0

### Minor Changes

- Changed plugin API `preHandler` and `postHandler` functions to `startup` and `shutdown` (with different arguments available). [#375](https://github.com/paularmstrong/onerepo/pull/375) ([@paularmstrong](https://github.com/paularmstrong))

## 0.3.0

### Minor Changes

- No longer re-throws errors thrown from handlers. If an error is encountered, the process will still set the exit code (`1`), but will not crash the process to ensure cleanup and post-handlers are completed properly. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Using `getFilepaths` and `getters.getFilepaths` to return the list of affected filepaths now has a threshold. When the threshold is reached, the relative workspace locations for the affected files will be returned instead. This threshold can be configured via the getter options: `{ affectedThreshold: number }`. [#370](https://github.com/paularmstrong/onerepo/pull/370) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
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
  - @onerepo/logger@0.2.1
  - @onerepo/subprocess@0.3.1

## 0.2.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89)]:
  - @onerepo/builders@0.2.0
  - @onerepo/logger@0.2.0
  - @onerepo/subprocess@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/builders@0.1.1
  - @onerepo/subprocess@0.2.1

## 0.1.1

### Patch Changes

- Allow command `description` to be `false`. There are times when a command should remain undocumented and hidden from general use and this is how Yargs allows doing so. [#142](https://github.com/paularmstrong/onerepo/pull/142) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0

## 0.0.2

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/builders@0.0.2
  - @onerepo/logger@0.0.2

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Moved worktree determination to before initial yargs building to ensure graph is working from the worktree instead of the main repo root. [#49](https://github.com/paularmstrong/onerepo/pull/49) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Change internal minimatch usage to use default export. [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc)]:
  - @onerepo/logger@0.0.1
  - @onerepo/builders@0.0.1
