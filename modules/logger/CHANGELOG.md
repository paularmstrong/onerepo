# @onerepo/logger

## 1.0.3

> View the full changelog: [c8234dc...9359c78](https://github.com/paularmstrong/onerepo/compare/c8234dc79f7b7f40ca42167d41a6a6f4126c5286...9359c78e4da54e0402ad6a4bf5890a8a71972c8e)

## 1.0.2

> View the full changelog: [74892d8...d7f3a29](https://github.com/paularmstrong/onerepo/compare/74892d8605917bb0d8a1c3fe113d1b04f2505abb...d7f3a2956c6d8ea4a4346ac2541b67196fdc6011)

## 1.0.1

### Patch changes

- Prevents an EventEmitter memory leak stemming from the logger's internal `LogBuffer` by piping streams instead of adding and removing listeners. ([f22e04d](https://github.com/paularmstrong/onerepo/commit/f22e04d4e589f4efe660fd8cf940ebf026b39542))
  Previously, you may experience the following error when receiving a lot of output from subprocesses (particularly eslint):
  ```
  (node:30394) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added to [LogBuffer]. Use emitter.setMaxListeners() to increase limit
  (Use `node --trace-warnings ...` to show where the warning was created)
  ```

> View the full changelog: [cd94664...6ae1391](https://github.com/paularmstrong/onerepo/compare/cd9466419b207f690e55f87d0e4632eebdc0ca6a...6ae13912ef4b9bedab788be13fa167a709b26bba)

## 1.0.0

🎉 Initial stable release!

_For historical changelogs, please view the [oneRepo source](https://github.com/paularmstrong/onerepo/tree/main/modules/logger)._
