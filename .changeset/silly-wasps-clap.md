---
'@onerepo/core': minor
'onerepo': minor
'@onerepo/yargs': minor
---

No longer re-throws errors thrown from handlers. If an error is encountered, the process will still set the exit code (`1`), but will not crash the process to ensure cleanup and post-handlers are completed properly.
