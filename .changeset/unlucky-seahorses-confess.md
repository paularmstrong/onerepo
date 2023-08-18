---
'@onerepo/file': patch
'onerepo': patch
---

Fixed file `write`, `writeSafe`, and `format` when using prettier@2 in which prettier formatting would not be run at all.
