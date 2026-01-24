---
type: major
---

Hidden files in `one generate` templates (files beginning with a dot `.`) must now be prefixed with an template empty string, `<%-""%>.filename`.

This is to work around in a bug in Node <=24.13.0. Without this prefix, they will be ignored.
