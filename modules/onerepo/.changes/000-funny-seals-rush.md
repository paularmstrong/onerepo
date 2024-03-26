---
type: patch
---

When passing an absolute path to the `one codeowners show` command, eg `--file /home/dev/path/to/file`, matching the file to owners would throw an error:

```
RangeError: path should be a `path.relative()`d string, but got "."
```
