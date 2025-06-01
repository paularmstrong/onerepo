---
type: major
---

Warnings will no longer cause ESLint checks to fail.

A good rule to stand by: if something is a warning, it will be perceived as noise and never get fixed. Lint rules should either be full on errors, auto-fixed, or disabled. While it is not recommended, you can ee-enable failures on warnings with `eslint({ warnings: true })`. Do note that this may be a huge inconvenience for developers and you’ll be better off either disabling those rules or turning them into errors.
