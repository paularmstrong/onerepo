---
'@onerepo/subprocess': patch
---

When creating a `detached` subprocess, automatically sets `stdio` to `ignore` to speed up unref performance.
