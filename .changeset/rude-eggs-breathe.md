---
'@onerepo/builders': patch
'@onerepo/core': patch
'@onerepo/create': patch
'create-onerepo': patch
'eslint-formatter-onerepo': patch
'@onerepo/file': patch
'@onerepo/git': patch
'@onerepo/graph': patch
'@onerepo/logger': patch
'onerepo': patch
'@onerepo/package-manager': patch
'@onerepo/subprocess': patch
'@onerepo/test-cli': patch
'@onerepo/yargs': patch
'@onerepo/plugin-changesets': patch
'@onerepo/plugin-eslint': patch
'@onerepo/plugin-jest': patch
'@onerepo/plugin-prettier': patch
'@onerepo/plugin-typescript': patch
'@onerepo/plugin-vitest': patch
'@onerepo/docs': patch
'@onerepo/github-action': patch
'@onerepo/root': patch
---

Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc.
