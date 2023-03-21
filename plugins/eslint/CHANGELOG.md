# @onerepo/plugin-eslint

## 0.3.0

### Minor Changes

- Adds `quiet` config option to control the default value of `--quiet` when running ESLint. [#197](https://github.com/paularmstrong/onerepo/pull/197) ([@paularmstrong](https://github.com/paularmstrong))

  Basically, the opinion is that warnings are useless and shouldn’t be set as such – unless you are actively working to remove warnings and convert them to errors, that is.

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
  - @onerepo/builders@0.0.2
  - @onerepo/git@0.0.2
  - @onerepo/logger@0.0.2

## 0.1.0

### Minor Changes

- Respect .eslintignore files when linting across files and paths (as opposed to `--all`) [#60](https://github.com/paularmstrong/onerepo/pull/60) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Change internal minimatch usage to use default export. [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`0a3bb03`](https://github.com/paularmstrong/onerepo/commit/0a3bb03d0e33b2ac9505d43d9a2f0b87443e88f1)]:
  - @onerepo/logger@0.0.1
  - @onerepo/subprocess@0.0.1
  - @onerepo/git@0.0.1
  - @onerepo/builders@0.0.1
