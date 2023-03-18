---
'@onerepo/plugin-changesets': minor
---

When running `changesets version`, the package manager’s `install` command will be run before exiting and the updated lockfile will be added to the git index when `--add` is `true` (default).
