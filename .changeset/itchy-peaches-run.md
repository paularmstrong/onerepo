---
'@onerepo/plugin-changesets': patch
---

Use `yarn npm info` if working in a repository that uses Yarn when determining workspaces needing publish. This is necessary in case there are custom registries set up in the `.yarnrc.yml` either globally or scoped – otherwise the correct authentication method won't be used and the result could either always return E404 (package does not exist) or 401 auth error.
