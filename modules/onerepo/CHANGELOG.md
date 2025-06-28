# onerepo

## 2.0.0

### Major changes

- Functional testing custom oneRepo commands is no longer supported through Jest. Please consider Vitest instead. ([ca223bb](https://github.com/paularmstrong/onerepo/commit/ca223bb574ae16ea7aaee17804fde24fdf40bd36))
- Dropped Node 18 support. Minimum Node versions are now `^20.19.0 || ^22.10.0 || ^24`. ([ace1053](https://github.com/paularmstrong/onerepo/commit/ace1053c60cbc9a6079314d4abc598b014d776c1))

### Minor changes

- Upgrades Yargs to [v18.0.0](https://github.com/yargs/yargs/releases/tag/v18.0.0) ([ca223bb](https://github.com/paularmstrong/onerepo/commit/ca223bb574ae16ea7aaee17804fde24fdf40bd36))
- Officially support Node 22 ([2e662a9](https://github.com/paularmstrong/onerepo/commit/2e662a9c7a27709fd92caecc6547012040d162c4))

### Patch changes

- Internal-only type and formatting updates. ([35af90a](https://github.com/paularmstrong/onerepo/commit/35af90aad3a5301853a6232d9aee6119b02f8188))
- Updates build dependency "esbuild". ([9092312](https://github.com/paularmstrong/onerepo/commit/909231235ac5ae065978656e51777e9a40e91e37))
- Update internal typescript resolution package (Jiti) ([29c6af1](https://github.com/paularmstrong/onerepo/commit/29c6af1ad519ae7bd3ca3eb445ad34313909fc62))

### Dependencies updated

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

## 1.2.0

### Minor changes

- Use a new option in `git.getModifiedFiles` to return all files mapped by status instead of only added & modified files as an array: `git.getModifiedFiles({ byStatus: true })`. ([a2942ed](https://github.com/paularmstrong/onerepo/commit/a2942ede514a65f5d09ff4595ca8bb616a83c5e5))
- Adds support for the `pre-push` git hook in `tasks` lifecycles. ([0c9a5d5](https://github.com/paularmstrong/onerepo/commit/0c9a5d50b02cee2346dca99baca177469563c65c))

### Patch changes

- Fixed `one dependencies` commands that require deduping when using `pnpm`. ([9895235](https://github.com/paularmstrong/onerepo/commit/98952352d3c32adf853657e46e14f12fe1737992))
- Ensures `deleted` files and other git status types other than `add` and `modified` are evaluated when running `one tasks`. ([9895235](https://github.com/paularmstrong/onerepo/commit/98952352d3c32adf853657e46e14f12fe1737992))
- Updated internal/third-party typescript definitions ([e5fb5fa](https://github.com/paularmstrong/onerepo/commit/e5fb5fa0e9fbe6ff18c2d993cb22119a3908df73))
- Internal test changes to support Vitest 2 ([f3d116d](https://github.com/paularmstrong/onerepo/commit/f3d116d4a846c9f21051b01370caec80526ef2c0))
- Internal formatting changes due to Prettier upgrade. ([f8cb805](https://github.com/paularmstrong/onerepo/commit/f8cb80550ceabdce6ff6c13bf22466a59e694b0f))
- Clarify bootstrap configuration errors to include the full stack trace. ([4b0ac6c](https://github.com/paularmstrong/onerepo/commit/4b0ac6cbcabe9988597b0fc055d73b4a7c88b85e))
- Minor typo/grammar updates for `change` command CLI options. ([afbf0a7](https://github.com/paularmstrong/onerepo/commit/afbf0a7980d54960b54a0f27956ce421a9723c92))

### Dependencies updated

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

## 1.1.2

### Dependencies updated

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

## 1.1.1

### Patch changes

- Fixes execution of subtasks in NPM repositories when commands use `graph.packageManager.run()`. ([d7f3a29](https://github.com/paularmstrong/onerepo/commit/d7f3a2956c6d8ea4a4346ac2541b67196fdc6011))
- Fixed regression in dependency verification that would not fail against local workspace versions when pinning exact version numbers. ([be88279](https://github.com/paularmstrong/onerepo/commit/be882795966edd469524734de8140be6fc111685))
  Thanks [@alecmev](https://github.com/alecmev)!
- When verifying dependencies, ensure public packages do not have production dependencies that are marked private (and non-publishable). ([be88279](https://github.com/paularmstrong/onerepo/commit/be882795966edd469524734de8140be6fc111685))
  Thanks [@alecmev](https://github.com/alecmev)!
- Removed the `@internal` flag from `config` on `HandlerExtra`, exposing the type information for consumers and documenting the available information. ([f94e116](https://github.com/paularmstrong/onerepo/commit/f94e1165dbfcab2d9826a6202d3f317755b8881e))
  Thanks [@alecmev](https://github.com/alecmev)!
- Ensures the resolved config is passed to command HandlerExtra. ([f94e116](https://github.com/paularmstrong/onerepo/commit/f94e1165dbfcab2d9826a6202d3f317755b8881e))
- Fixed typo/grammar mistake in git workflow docs. ([f772097](https://github.com/paularmstrong/onerepo/commit/f77209731674a8fd0286bd0a8c0cf2eced952ba1))
- Clarify `generate` command option is `templateDir` and not `templatesDir`, internally as well as in all help output & documentation. ([867f066](https://github.com/paularmstrong/onerepo/commit/867f066932b7a133b1ecd8402301a97c8e7de298))
- When passing an absolute path to the `one codeowners show` command, eg `--file /home/dev/path/to/file`, matching the file to owners would throw an error: ([6266a6d](https://github.com/paularmstrong/onerepo/commit/6266a6d68977e34ea1cc26d21b75ab9134c55451))
  ```
  RangeError: path should be a `path.relative()`d string, but got "."
  ```

### Dependencies updated

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

## 1.1.0

### Minor changes

- Adds `one change show` to help preview changes in Workspaces" ([15bff1b](https://github.com/paularmstrong/onerepo/commit/15bff1b955e82c137a1a64993738421d3da1fdf9))
- Adds `one codeowners show` to list out owners on modified or input files. ([ce67f33](https://github.com/paularmstrong/onerepo/commit/ce67f3379784461dc185fdc7f4f8608300ef8798))

### Patch changes

- Capitalized “Graph” in documentation, help output, and tsdoc comments. ([8f3d968](https://github.com/paularmstrong/onerepo/commit/8f3d9682c465639c3ecc7c7711dc7b18a349ca9d))
- Capitalized “Workspace” and “Workspaces” in documentation, help output, and tsdoc comments. ([9534837](https://github.com/paularmstrong/onerepo/commit/95348376ff60578ceb9f04047b94fe912f0f42c1))
- Prevents an EventEmitter memory leak stemming from the logger's internal `LogBuffer` by piping streams instead of adding and removing listeners. ([f22e04d](https://github.com/paularmstrong/onerepo/commit/f22e04d4e589f4efe660fd8cf940ebf026b39542))
  Previously, you may experience the following error when receiving a lot of output from subprocesses (particularly eslint):
  ```
  (node:30394) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added to [LogBuffer]. Use emitter.setMaxListeners() to increase limit
  (Use `node --trace-warnings ...` to show where the warning was created)
  ```
- Updated URL in `one generate --help` output to point to correct online source.` ([21b8d0d](https://github.com/paularmstrong/onerepo/commit/21b8d0d8f9fd462e20c84c9a688762b75bcd8c06))

### Dependencies updated

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

_For historical changelogs, please view the [oneRepo source](https://github.com/paularmstrong/onerepo/tree/main/modules/onerepo)._
