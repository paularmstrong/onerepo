# onerepo

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
