---
'@onerepo/core': patch
'onerepo': patch
---

When tasks run `one` commands, they are now run directly in the same process instead of spawned to a new process. This reduces run time for fast tasks significantly by removing file glob, yargs startup, and file parsing (& potentially compilation through esbuild).
