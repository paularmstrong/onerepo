---
'@onerepo/core': patch
'onerepo': patch
---

Task matchers will fully add or remove a task from a lifecycle run if their globs are matched or not. This makes them a bit more powerful, but may cause a little more confusion at the same time:

- If a task matcher does not match any of the modified files, the task will not run, despite the workspace tasks being triggered if other files in the workspace (or the root) were modified.
- If a task matcher matches a path using relative matching outside of its workspace, eg, `match: '../other-module/**/*.ts'`, the task will be added to the run despite the workspace _not_ being modified.
