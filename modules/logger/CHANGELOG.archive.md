# @onerepo/logger

## 1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.7.0

### Minor changes

- Logging an empty function will now execute and stringify the return value of the function. This will prevent expensive loops used to build up helpful information strings. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
  ```ts
  step.log(() => bigArray.map((item) => item.name));
  ```

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.6.0

### Minor Changes

- When a LogStep has not properly ended while its parent Logger is ended, a warning will be thrown in the step. [#562](https://github.com/paularmstrong/onerepo/pull/562) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Unpausing the logger will now correctly resume the animated step output. [#509](https://github.com/paularmstrong/onerepo/pull/509) ([@paularmstrong](https://github.com/paularmstrong))

## 0.5.0

### Minor Changes

- New `Logger` instances can be buffered to parent instance steps using `bufferSubLogger(step: LogStep)`. [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- It is possible to create more instances of `Logger`. The most recently created instance will be used for functions that require a logger from the global scope. [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Calls to logging methods on the default `logger` will no longer be dropped when intermixed between sub-steps. Output may come _after_ a step, depending on event loop timing. [#488](https://github.com/paularmstrong/onerepo/pull/488) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.1

### Patch Changes

- Ability to set `logger.verbosity` to `0` via `getLogger()` method. [#428](https://github.com/paularmstrong/onerepo/pull/428) ([@paularmstrong](https://github.com/paularmstrong))

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

## 0.4.0

### Minor Changes

- When run in GitHub workflows, log steps will be collapsed as grouped output for faster scanning and debugging. [#425](https://github.com/paularmstrong/onerepo/pull/425) ([@paularmstrong](https://github.com/paularmstrong))

- Add Logger info method to be used to convey information and instrctions through the logs [#407](https://github.com/paularmstrong/onerepo/pull/407) ([@jakeleveroni](https://github.com/jakeleveroni))

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Logger verbosity is now explicitly number `0` through `5`. [#423](https://github.com/paularmstrong/onerepo/pull/423) ([@paularmstrong](https://github.com/paularmstrong))

## 0.3.0

### Minor Changes

- Overhauled performance logging. All marks are pairs that start with `onerepo_start_` and `onerepo_end_`. By default, these will be converted into [Node.js performance `measure` entries](https://nodejs.org/api/perf_hooks.html#class-performancemeasure) for use in your own telemetry implementation. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Allows passing in a custom stream to override writing to `process.stderr`. Mostly useful for dependency injection during testing. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fixed a regression that prevented the default logger from writing out any logs until after all steps were completed. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Prevents "maximum call stack exceeded" in logging when attempting to dim output through picocolors [#342](https://github.com/paularmstrong/onerepo/pull/342) ([@paularmstrong](https://github.com/paularmstrong))

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Clarified usage of `logger` should be restricted to only the one that is given in `HandlerExtra` [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures the logger closes all timers and file descriptors. [#372](https://github.com/paularmstrong/onerepo/pull/372) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.1

### Patch Changes

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

## 0.2.0

### Minor Changes

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Fixes `--silent` to ensure steps are not written when the terminal is TTY. [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.1

### Patch Changes

- Fixed log output including too many newlines. [`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed interleaving root logger output between steps [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

## 0.0.2

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- When pausing the logger, ensure the current steps are written out and not cleared first to avoid missing context. [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure no logs are written when verbosity is `0` by fully preventing `enableWrite` during the `activate` call of each `Step` [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))
