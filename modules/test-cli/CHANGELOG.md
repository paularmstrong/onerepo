# @onerepo/test-cli

## 0.5.4

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.4
  - @onerepo/yargs@0.5.5

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.3
  - @onerepo/yargs@0.5.4

## 0.5.2

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.5.2
  - @onerepo/yargs@0.5.3

## 0.5.1

### Patch Changes

- Updated dependencies [[`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`218b130`](https://github.com/paularmstrong/onerepo/commit/218b130ba5b2c7223eb471e23bcdcfbabc6861b4), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149)]:
  - @onerepo/logger@0.5.0
  - @onerepo/yargs@0.5.2
  - @onerepo/builders@0.5.1
  - @onerepo/graph@0.9.2

## 0.5.0

### Minor Changes

- `build()` and `run()` now allow overriding the executable (`process.argv[1]`) as well as some hard-coded `ONE_REPO_` environment variables through the second argument to each function. [`9b070c4`](https://github.com/paularmstrong/onerepo/commit/9b070c411c9c33cad8b48c84acb8d3dc37358f9f) ([@jakeleveroni](https://github.com/jakeleveroni))

  ```ts
  const { build, run } = getCommand(Command);

  test('in build', async () => {
    await expect(build('foo', { argv: '/foo/bar/bin', env: { … } })).toEqual({ … });
  });

  test('in run', async () => {
    await run('foo', { graph, argv: '/foo/bar/bin', env: { … } });
  });
  ```

### Patch Changes

- Made parsing input arguments to `run()` and `build()` in tests more reliable by going straight to Yargs instead of parse/unparse. [#473](https://github.com/paularmstrong/onerepo/pull/473) ([@paularmstrong](https://github.com/paularmstrong))

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1
  - @onerepo/builders@0.5.0
  - @onerepo/graph@0.9.1
  - @onerepo/yargs@0.5.1

## 0.4.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/builders@0.4.0
  - @onerepo/graph@0.9.0
  - @onerepo/yargs@0.5.0

## 0.3.2

### Patch Changes

- Updated dependencies [[`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff)]:
  - @onerepo/graph@0.8.0

## 0.3.1

### Patch Changes

- Updated dependencies [[`1b8566d`](https://github.com/paularmstrong/onerepo/commit/1b8566d1ee4cca60cacd237c5891d57a834c491d)]:
  - @onerepo/yargs@0.4.0

## 0.3.0

### Minor Changes

- Running command handlers in tests will return the logger output to avoid the need to spy on `process.stderr`. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Failing command handlers due to `logger.error` or `logStep.error` calls will now properly reject the handler with the full log output string. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/builders@0.3.0
  - @onerepo/graph@0.7.1
  - @onerepo/yargs@0.3.0

## 0.2.5

### Patch Changes

- Updated dependencies [[`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646), [`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646)]:
  - @onerepo/graph@0.7.0

## 0.2.4

### Patch Changes

- Updated dependencies []:
  - @onerepo/builders@0.2.2
  - @onerepo/yargs@0.2.2

## 0.2.3

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/builders@0.2.1
  - @onerepo/graph@0.6.1
  - @onerepo/logger@0.2.1
  - @onerepo/yargs@0.2.1

## 0.2.2

### Patch Changes

- Updated dependencies [[`9004117`](https://github.com/paularmstrong/onerepo/commit/900411775b115763adc383e328b77f7d24ae6209), [`d88f906`](https://github.com/paularmstrong/onerepo/commit/d88f906381b729f052f347d6b7ebcec9bf6a24cc)]:
  - @onerepo/graph@0.6.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/graph@0.5.0

## 0.2.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89)]:
  - @onerepo/builders@0.2.0
  - @onerepo/graph@0.4.0
  - @onerepo/logger@0.2.0
  - @onerepo/yargs@0.2.0

## 0.1.2

### Patch Changes

- Better handling when using Jest, which may or may not be using ESM properly. Falls back on using `__dirname` when building mock graphs if `__dirname` is defined and `import.meta.url` is not. [#177](https://github.com/paularmstrong/onerepo/pull/177) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`68018fe`](https://github.com/paularmstrong/onerepo/commit/68018fe439e6ce7bbbd12c71d8662779692a66d4), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1
  - @onerepo/graph@0.3.0
  - @onerepo/builders@0.1.1
  - @onerepo/yargs@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136), [`248af36`](https://github.com/paularmstrong/onerepo/commit/248af36e324824ec9587190e73ea7fe03bc955f3)]:
  - @onerepo/graph@0.2.1
  - @onerepo/yargs@0.1.1

## 0.1.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/graph@0.2.0
  - @onerepo/logger@0.1.0
  - @onerepo/yargs@0.1.0

## 0.0.2

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/graph@0.1.1
  - @onerepo/logger@0.0.2

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc)]:
  - @onerepo/logger@0.0.1
  - @onerepo/graph@0.1.0
