---
'@onerepo/package-manager': patch
'@onerepo/plugin-changesets': patch
---

When getting publishable packages from the registry, missing packages would respond with an error and prevent subsequent packages from being determined, resulting in some new packages not being marked as publishable.
