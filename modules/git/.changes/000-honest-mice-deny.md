---
type: minor
---

`updateIndex()` requires either passing the option `immediately: true` or calling `flushUpdateIndex()` afterwards in order to actually write to the git index.

This process is designed to avoid race conditions from parallel calls which could cause git to become in a bad state, requiring users manually delete their `.git/index.lock` file.
