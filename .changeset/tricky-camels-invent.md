---
'@onerepo/core': patch
'@onerepo/git': patch
'onerepo': patch
---

Apply unstaged changes using a better merge strategy from the stash to ensure that even in the event of conflicts, the stash is applied before being dropped.
