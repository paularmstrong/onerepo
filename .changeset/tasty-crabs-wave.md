---
'@onerepo/file': patch
'onerepo': patch
---

Does not apply regex substitues during `file.writeSafe` calls (will write out string literals for `$'`, `$\``, etc.)
