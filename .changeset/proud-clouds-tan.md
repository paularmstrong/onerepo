---
'@onerepo/test-cli': patch
---

Better handling when using Jest, which may or may not be using ESM properly. Falls back on using `__dirname` when building mock graphs if `__dirname` is defined and `import.meta.url` is not.
