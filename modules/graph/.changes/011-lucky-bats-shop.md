---
type: minor
---

Refactored internals for applying `package.json` `publishConfig` entries. Use `workspace.publishablePackageJson` to get a safe version of the Workspace's `package.json` file, ready for publishing.
