---
'@onerepo/core': patch
'@onerepo/git': patch
'onerepo': patch
---

Do not force checkout files if there are no partially staged files during task runs that use the git staging workflow.
