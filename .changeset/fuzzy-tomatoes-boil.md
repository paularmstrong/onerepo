---
'@onerepo/plugin-changesets': patch
---

When publishing a module for the first time, `npm info` version lookup will fail. We will now gracefully handle this and assume it should be published.
