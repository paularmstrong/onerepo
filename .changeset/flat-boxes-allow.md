---
'eslint-formatter-onerepo': patch
'@onerepo/plugin-eslint': patch
---

Fixes an issue with the ESLint plugin that caused it to never error. Internally, this fixes the build/distribution of `eslint-formatter-onerepo` to build as commonjs instead of esm, since eslint cannot do esm.
