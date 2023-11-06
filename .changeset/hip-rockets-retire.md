---
'@onerepo/test-cli': patch
---

Made parsing input arguments to `run()` and `build()` in tests more reliable by going straight to Yargs instead of parse/unparse.
