---
'@onerepo/logger': patch
'onerepo': patch
---

Calls to logging methods on the default `logger` will no longer be dropped when intermixed between sub-steps. Output may come _after_ a step, depending on event loop timing.
