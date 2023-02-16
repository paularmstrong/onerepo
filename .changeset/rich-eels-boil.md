---
'@onerepo/yargs': patch
'@onerepo/cli': patch
---

Moved worktree determination to before initial yargs building to ensure graph is working from the worktree instead of the main repo root.
