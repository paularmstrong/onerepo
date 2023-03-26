---
'@onerepo/builders': minor
'onerepo': minor
---

`builders.withAffected` now includes a `--staged` argument. When used with `--affected`, handler extras `getFilepaths` and `getWorkspaces` will only get files/workspaces based on the current git stage and ignore files that have not be added to the stage list.
