---
'@onerepo/git': patch
'onerepo': patch
---

When getting modified files (`git.getModifiedFiles()` or HandlerExtra's `getFilepaths()`), only return the staged files if in a state with modified files. This prevents running `eslint`, `prettier`, and others across uncommitted files, especially in git `pre-commit` hooks.
