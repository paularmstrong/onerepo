---
'@onerepo/logger': patch
'onerepo': patch
---

Ensure no logs are written when verbosity is `0` by fully preventing `enableWrite` during the `activate` call of each `Step`
