---
'@onerepo/plugin-changesets': patch
---

When versioning workspaces, check for other workspaces not in the list of those selected for release. If there are more that need to be added outside of the direct dependency chain, warn the user and confirm okay to continue including those workspaces as well.
