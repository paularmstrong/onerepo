---
'@onerepo/core': minor
---

Added standard build lifecycles and enable automatically running `pre-` and `post-` prefixed lifecycles if not directly specified in the given lifecycle. Running `one tasks -c pre-commit` will still only run `pre-commit`, but `one tasks -c commit` will run all of `pre-commit`, `commit`, and `post-commit` tasks, in order.
