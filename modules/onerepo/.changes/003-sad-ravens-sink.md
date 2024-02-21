---
type: minor
---

`git.updateIndex()` requires either passing the option `immediately: true` or calling `git.flushUpdateIndex()` afterwards in order to actually write to the git index.

This process is designed to avoid race conditions from parallel calls which could cause git to become in a bad state, requiring users manually delete their `.git/index.lock` file.

> Note: you should not normally need to make any changes to account for this. oneRepo commands will automatically call `flushUpdateIndex()` as necessary during shutdown.
