---
type: patch
---

Cancelling `tasks` should no longer result in conflicted `.git/index.lock` files when shut down while trying to add files to the git index/stage.
