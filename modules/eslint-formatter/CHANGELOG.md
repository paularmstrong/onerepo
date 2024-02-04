# eslint-formatter-onerepo

## 0.1.2

> View the full changelog: [d1f6cce5...3832aa9f](https://github.com/paularmstrong/onerepo/commits/d1f6cce5075619666721f813ffcba1957b637fbf...3832aa9f9fffdd83e9368d582e8396e9a0df9e65)

## 0.1.1

### Patch Changes

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

## 0.1.0

### Minor Changes

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

## 0.0.2

### Patch Changes

- Fixes an issue with the ESLint plugin that caused it to never error. Internally, this fixes the build/distribution of `eslint-formatter-onerepo` to build as commonjs instead of esm, since eslint cannot do esm. [#377](https://github.com/paularmstrong/onerepo/pull/377) ([@paularmstrong](https://github.com/paularmstrong))

## 0.0.1

### Patch Changes

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))
