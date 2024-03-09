---
type: patch
---

Prevents an EventEmitter memory leak stemming from the logger's internal `LogBuffer` by piping streams instead of adding and removing listeners.

Previously, you may experience the following error when receiving a lot of output from subprocesses (particularly eslint):

```
(node:30394) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added to [LogBuffer]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
```
