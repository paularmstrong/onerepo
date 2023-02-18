---
'@onerepo/plugin-changesets': patch
'@onerepo/git': patch
---

When looking for modified files, merge the current status along with the diff-tree from merge-base. This mostly affects plugin-changesets when running `changsets add` in that adding multiple changesets in a single command will continue to show all affected workspaces each time, regardless of uncommitted status.
