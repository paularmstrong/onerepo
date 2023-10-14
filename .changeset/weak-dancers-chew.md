---
'@onerepo/core': patch
'onerepo': patch
---

Ensures path configuration options for core commands `docgen`, `generate`, and `graph` are relative to the repository root to ensure correct resolution across git worktrees.
