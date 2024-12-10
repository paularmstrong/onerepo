---
type: minor
---

Added a git utility method to get modified files and bucket them based on the modification operation.
Updated tasks command to use the new git getModifiedByStatus method so deleted files are included as changes when generating tasks.
