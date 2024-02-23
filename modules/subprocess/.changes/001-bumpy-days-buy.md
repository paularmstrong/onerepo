---
type: patch
---

When a subprocess fails and has both stdout and stderr, ensure that the entire stdout+stderr is replayed in the error log â€“ and in the correct order.
