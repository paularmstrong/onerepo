---
'onerepo': minor
---

Setup and configuration has had a major change.

- Run the following to install the `one` executable:

  ```sh
  npx --project=onerepo one install
  ```

- Delete `/usr/local/bin/<your-executable-name>`. Executable name will always be `one` or `onerepo` (alias) from now on. You can create your own alias if desired, but it is not recommended.
- Move configuration of `setup()` from `./bin/<your-executable>.mjs` to `onerepo.config.js`. See documentation for more information on setting up configurations.
