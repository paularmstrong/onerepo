---
'@onerepo/plugin-changesets': patch
---

When versioning packages, only production dependencies will be versioned, even if dev dependencies have changes. This should be safe because `devDependencies` are explicitly stripped out during publish.
