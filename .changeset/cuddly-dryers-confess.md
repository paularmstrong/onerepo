---
'onerepo': minor
'@onerepo/subprocess': minor
---

When running a `batch()` process, if there are only 2-CPUs available, use both CPUs instead of `cpus.length - 1`. While we normally encourage using one less than available to avoid locking up the main processes, it should still be faster to spawn a separate process to the same CPU than to do all tasks synchronously.
