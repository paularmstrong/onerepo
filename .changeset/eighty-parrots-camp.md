---
'@onerepo/types': patch
'@onerepo/logger': patch
'@onerepo/yargs': patch
'@onerepo/subprocess': patch
'@onerepo/graph': patch
'@onerepo/plugin-graph': patch
'@onerepo/test-cli': patch
'@onerepo/git': patch
'@onerepo/plugin-vitest': patch
'@onerepo/plugin-tasks': patch
'@onerepo/plugin-prettier': patch
'@onerepo/file': patch
'@onerepo/plugin-install': patch
'@onerepo/plugin-generate': patch
'@onerepo/plugin-docgen': patch
'@onerepo/plugin-changesets': patch
'@onerepo/cli': patch
'@onerepo/builders': patch
'@onerepo/plugin-typescript': patch
'@onerepo/plugin-eslint': patch
'onerepo': patch
---

Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs.
