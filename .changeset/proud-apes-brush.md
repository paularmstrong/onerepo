---
'@onerepo/core': patch
'@onerepo/git': patch
'onerepo': patch
---

When running git staging workflow (eg, during `tasks -c pre-commit`), forcibly skip all git hooks, not just using HUSKY environment variables.
