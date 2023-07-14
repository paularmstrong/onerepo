---
'@onerepo/core': minor
'onerepo': minor
---

Added optional key `$required` to JSON schema validation via `graph verify` to mark files as required. If set to true and no files via the file glob are found in matching workspaces, an error will be logged and the command will fail.
