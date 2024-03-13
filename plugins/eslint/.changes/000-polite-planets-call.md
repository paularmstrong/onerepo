---
type: patch
---

When passing an absolute path to the command, eg `--file /home/dev/path/to/file`, ignores filtering would throw an error:

```
RangeError: path should be a `path.relative()`d string, but got "."
```
