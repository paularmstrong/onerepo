---
'@onerepo/test-cli': minor
---

Running command handlers in tests will return the logger output to avoid the need to spy on `process.stderr`.
