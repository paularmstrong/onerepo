---
'@onerepo/plugin-changesets': patch
---

When versioning a workspace based on changesets, also forcefully select _dependencies_ and apply their changesets as well. This fixes a behavior where the _affected_ workspaces were selected, which is the opposite behavior we actually wanted here.
