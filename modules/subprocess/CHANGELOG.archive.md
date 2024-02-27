# @onerepo/subprocess

## 1.0.0

### Dependencies updated

- @onerepo/logger@1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

### Dependencies updated

- @onerepo/logger@1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

### Dependencies updated

- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Minor changes

- Adds option `maxParallel` to `batch()` processes to manually control the maximum number of parallel subprocesses to run. This number will still be limited by the number of CPU cores available. ([483d7c0](https://github.com/paularmstrong/onerepo/commit/483d7c000ca69f094a43797f05e8f0432e2a5d70))

### Patch changes

- When a subprocess fails and has both stdout and stderr, ensure that the entire stdout+stderr is replayed in the error log â€“ and in the correct order. ([d60f641](https://github.com/paularmstrong/onerepo/commit/d60f641070204496707e5419dd2ee4f1da41c1ca))

### Dependencies updated

- @onerepo/logger@1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

### Dependencies updated

- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.7.1

### Dependencies updated

- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.7.0

### Minor Changes

- Environment variable prefixes have been changed from `ONE_REPO_` to `ONEREPO_` for consistency. [#559](https://github.com/paularmstrong/onerepo/pull/559) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- When creating a `detached` subprocess, automatically sets `stdio` to `ignore` to speed up unref performance. [#559](https://github.com/paularmstrong/onerepo/pull/559) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947)]:
  - @onerepo/logger@0.6.0

## 0.6.0

### Minor Changes

- `batch()` now also accepts async/promise-based functions, as long as they will return a response of `[string, string]` (`[output, errorOutput]`). [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- `batch()` calls will preserve order of output to match the order of input specs, similar to `Promise.all()`. [#488](https://github.com/paularmstrong/onerepo/pull/488) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149)]:
  - @onerepo/logger@0.5.0

## 0.5.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/logger@0.4.1

## 0.5.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- DRY-RUN information will now be written as INFO lines instead of warnings. [#423](https://github.com/paularmstrong/onerepo/pull/423) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0

## 0.4.0

### Minor Changes

- Overhauled performance logging. All marks are pairs that start with `onerepo_start_` and `onerepo_end_`. By default, these will be converted into [Node.js performance `measure` entries](https://nodejs.org/api/perf_hooks.html#class-performancemeasure) for use in your own telemetry implementation. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Ensures current environment variables are passed through to subprocesses (normally the default) when passing in extra custom environment variables. [#346](https://github.com/paularmstrong/onerepo/pull/346) ([@paularmstrong](https://github.com/paularmstrong))

  ```ts
  await run({
  	// ...
  	opts: {
  		// The following will be merged with `...process.env`
  		env: { MY_ENV_VAR: 'true' },
  	},
  });
  ```

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Subprocess `sudo` command will now respect `--dry-run` settings [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0

## 0.3.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/logger@0.2.1

## 0.3.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b)]:
  - @onerepo/logger@0.2.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/logger@0.1.1

## 0.2.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/logger@0.1.0

## 0.1.1

### Patch Changes

- When `skipFailures` in `run()` is set to `true`, do not log any errors or reject the promise. [#135](https://github.com/paularmstrong/onerepo/pull/135) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.0

### Minor Changes

- When running a `batch()` process, if there are only 2-CPUs available, use both CPUs instead of `cpus.length - 1`. While we normally encourage using one less than available to avoid locking up the main processes, it should still be faster to spawn a separate process to the same CPU than to do all tasks synchronously. [#132](https://github.com/paularmstrong/onerepo/pull/132) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/logger@0.0.2

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc)]:
  - @onerepo/logger@0.0.1
