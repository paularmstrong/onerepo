# @onerepo/package-manager

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
