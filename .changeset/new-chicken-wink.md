---
'@onerepo/core': minor
---

Removed implicit `pre-` and `post-` lifecycles for all non-prefixed lifecycles. No longer with running `--lifecycle=commit` auto run `pre-commit`, `commit`, and `post-commit` sequentially. If this behavior is still needed, change your task configurations to use the [sequential tasks](https://onerepo.tools/docs/core/tasks/#sequential-tasks) format.
