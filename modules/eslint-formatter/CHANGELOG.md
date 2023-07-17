# eslint-formatter-onerepo

## 0.0.2

### Patch Changes

- Fixes an issue with the ESLint plugin that caused it to never error. Internally, this fixes the build/distribution of `eslint-formatter-onerepo` to build as commonjs instead of esm, since eslint cannot do esm. [#377](https://github.com/paularmstrong/onerepo/pull/377) ([@paularmstrong](https://github.com/paularmstrong))

## 0.0.1

### Patch Changes

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))
