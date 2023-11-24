---
'onerepo': minor
'@onerepo/subprocess': minor
---

`batch()` now also accepts async/promise-based functions, as long as they will return a response of `[string, string]` (`[output, errorOutput]`).
