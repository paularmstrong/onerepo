---
'@onerepo/core': minor
'onerepo': minor
---

`tasks` will now stash any unstaged changes when running the `pre-commit` lifecycle and reapply them after completion. This option is configurable using the `stagedOnly` option on `core.tasks` in `setup()`.
