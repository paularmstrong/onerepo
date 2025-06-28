# @onerepo/plugin-prettier

## 2.0.0

### Major changes

- Dropped Node 18 support. Minimum Node versions are now `^20.19.0 || ^22.10.0 || ^24`. ([ace1053](https://github.com/paularmstrong/onerepo/commit/ace1053c60cbc9a6079314d4abc598b014d776c1))

### Minor changes

- Officially support Node 22 ([2e662a9](https://github.com/paularmstrong/onerepo/commit/2e662a9c7a27709fd92caecc6547012040d162c4))

### Patch changes

- Updates build dependency "esbuild". ([9092312](https://github.com/paularmstrong/onerepo/commit/909231235ac5ae065978656e51777e9a40e91e37))

### Dependencies updated

- onerepo@2.0.0
- @onerepo/test-cli@2.0.0
- @onerepo/yargs@2.0.0
- @onerepo/builders@2.0.0
- @onerepo/git@2.0.0
- @onerepo/graph@2.0.0
- @onerepo/package-manager@2.0.0
- @onerepo/subprocess@2.0.0
- @onerepo/file@2.0.0
- @onerepo/logger@2.0.0

> View the full changelog: [04603c7...ca223bb](https://github.com/paularmstrong/onerepo/compare/04603c746ee744e5072af47c7210637a468cf751...ca223bb574ae16ea7aaee17804fde24fdf40bd36)

## 1.0.4

### Patch changes

- Updated internal/third-party typescript definitions ([e5fb5fa](https://github.com/paularmstrong/onerepo/commit/e5fb5fa0e9fbe6ff18c2d993cb22119a3908df73))
- Internal formatting changes due to Prettier upgrade. ([f8cb805](https://github.com/paularmstrong/onerepo/commit/f8cb80550ceabdce6ff6c13bf22466a59e694b0f))

### Dependencies updated

- onerepo@1.2.0
- @onerepo/test-cli@1.0.4
- @onerepo/yargs@1.0.4
- @onerepo/builders@1.0.4
- @onerepo/git@1.1.0
- @onerepo/graph@1.0.4
- @onerepo/package-manager@1.0.4
- @onerepo/subprocess@1.0.4
- @onerepo/file@1.0.4
- @onerepo/logger@1.0.4

> View the full changelog: [a117f2a...9895235](https://github.com/paularmstrong/onerepo/compare/a117f2a8326b148de98fcffefc37e6ad46edcb87...98952352d3c32adf853657e46e14f12fe1737992)

## 1.0.3

### Patch changes

- Prevents a RangeError when more than 100 files are modified and/or passed to the command. ([00fb3f4](https://github.com/paularmstrong/onerepo/commit/00fb3f41a943afb2d1794182ad46dcd2bd0fb9cc))

### Dependencies updated

- onerepo@1.1.2
- @onerepo/test-cli@1.0.3
- @onerepo/yargs@1.0.3
- @onerepo/builders@1.0.3
- @onerepo/git@1.0.3
- @onerepo/graph@1.0.3
- @onerepo/package-manager@1.0.3
- @onerepo/subprocess@1.0.3
- @onerepo/file@1.0.3
- @onerepo/logger@1.0.3

> View the full changelog: [c8234dc...9359c78](https://github.com/paularmstrong/onerepo/compare/c8234dc79f7b7f40ca42167d41a6a6f4126c5286...9359c78e4da54e0402ad6a4bf5890a8a71972c8e)

## 1.0.2

### Patch changes

- When passing an absolute path to the command, eg `--file /home/dev/path/to/file`, ignores filtering would throw an error: ([6266a6d](https://github.com/paularmstrong/onerepo/commit/6266a6d68977e34ea1cc26d21b75ab9134c55451))
  ```
  RangeError: path should be a `path.relative()`d string, but got "."
  ```

### Dependencies updated

- onerepo@1.1.1
- @onerepo/test-cli@1.0.2
- @onerepo/yargs@1.0.2
- @onerepo/builders@1.0.2
- @onerepo/git@1.0.2
- @onerepo/graph@1.0.2
- @onerepo/package-manager@1.0.2
- @onerepo/subprocess@1.0.2
- @onerepo/file@1.0.2
- @onerepo/logger@1.0.2

> View the full changelog: [74892d8...d7f3a29](https://github.com/paularmstrong/onerepo/compare/74892d8605917bb0d8a1c3fe113d1b04f2505abb...d7f3a2956c6d8ea4a4346ac2541b67196fdc6011)

## 1.0.1

### Patch changes

- Fixes filtering input filepaths against the `.prettierignore` file ignores format. ([8b6fdea](https://github.com/paularmstrong/onerepo/commit/8b6fdea7a66b2675cd6e8af25bc28285d25bf5b8))

### Dependencies updated

- onerepo@1.1.0
- @onerepo/test-cli@1.0.1
- @onerepo/yargs@1.0.1
- @onerepo/builders@1.0.1
- @onerepo/git@1.0.1
- @onerepo/graph@1.0.1
- @onerepo/package-manager@1.0.1
- @onerepo/subprocess@1.0.1
- @onerepo/file@1.0.1
- @onerepo/logger@1.0.1

> View the full changelog: [cd94664...6ae1391](https://github.com/paularmstrong/onerepo/compare/cd9466419b207f690e55f87d0e4632eebdc0ca6a...6ae13912ef4b9bedab788be13fa167a709b26bba)

## 1.0.0

🎉 Initial stable release!

_For historical changelogs, please view the [oneRepo source](https://github.com/paularmstrong/onerepo/tree/main/plugins/plugin-prettier)._
