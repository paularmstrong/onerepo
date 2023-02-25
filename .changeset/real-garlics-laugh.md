---
'@onerepo/core': minor
---

Adds the ability to validate JSON files (like `package.json` and `tsconfig.json`) to ensure conformity across workspaces. This uses [AJV](https://ajv.js.org) with support for JSON schemas draft-2019-09 and draft-07. It also supports [ajv-errors](https://ajv.js.org/packages/ajv-errors.html) for better and more actionable error messaging.
