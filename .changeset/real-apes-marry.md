---
'@onerepo/builders': minor
'@onerepo/core': minor
'@onerepo/file': minor
'@onerepo/git': minor
'@onerepo/graph': minor
'@onerepo/logger': minor
'onerepo': minor
'@onerepo/subprocess': minor
'@onerepo/test-cli': minor
'@onerepo/yargs': minor
'@onerepo/plugin-changesets': minor
'@onerepo/plugin-docgen': minor
'@onerepo/plugin-eslint': minor
'@onerepo/plugin-prettier': minor
'@onerepo/plugin-typescript': minor
'@onerepo/plugin-vitest': minor
---

Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts.
