---
'@onerepo/yargs': patch
'@onerepo/core': patch
'onerepo': patch
---

Moved worktree determination to before initial yargs building to ensure graph is working from the worktree instead of the main repo root.
