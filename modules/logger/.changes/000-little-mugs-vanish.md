---
type: minor
---

The `Logger` and `LogStep` now implement streaming output differently in order to always fully capture potential output and switch on verbosity.

This is a major internal rewrite, but should be fully compatible with the previous implementations.
