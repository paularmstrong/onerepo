# onerepo

## 0.1.0

### Minor Changes

- Moved `generate` to core command. [#91](https://github.com/paularmstrong/onerepo/pull/91) ([@paularmstrong](https://github.com/paularmstrong))

- Added `${workspaces}` as a replacement token for spreading the list of affected workspaces through to individual tasks. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Adds the ability to specify inquirer `prompts` in `.onegen.js` files for `one generate` workspace generation. Answers will be spread as variable input to the EJS templates. [#94](https://github.com/paularmstrong/onerepo/pull/94) ([@paularmstrong](https://github.com/paularmstrong))

- Allow passing arbitrary meta information from the Task configs to the output information when using `one tasks --list`. [#84](https://github.com/paularmstrong/onerepo/pull/84) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fixes `commandDir` globbing to respect the `exclude` directive when parsing commands. [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

- When an option includes `choices`, list them in place of the `type` for options and positionals. [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Adds the ability to get a graph-data-structure that is isolated to the set of input sources using `graph.isolatedGraph(sources)`. Useful for debugging and walking the `affected` graph, not just an array like is returned from `.affected()`. [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

  Adds standard isolation inputs to `one graph show` to limit the output to `--all`, `--affected`, or a set of `--workspaces`.

- When pausing the logger, ensure the current steps are written out and not cleared first to avoid missing context. [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure no logs are written when verbosity is `0` by fully preventing `enableWrite` during the `activate` call of each `Step` [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

- Added standard build lifecycles and enable automatically running `pre-` and `post-` prefixed lifecycles if not directly specified in the given lifecycle. Running `one tasks -c pre-commit` will still only run `pre-commit`, but `one tasks -c commit` will run all of `pre-commit`, `commit`, and `post-commit` tasks, in order. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- It is now possible to pass a list of workspaces through to the `tasks` command to disregard the affected workspace calculation from `git` modified files. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Task matchers will fully add or remove a task from a lifecycle run if their globs are matched or not. This makes them a bit more powerful, but may cause a little more confusion at the same time: [#89](https://github.com/paularmstrong/onerepo/pull/89) ([@paularmstrong](https://github.com/paularmstrong))

  - If a task matcher does not match any of the modified files, the task will not run, despite the workspace tasks being triggered if other files in the workspace (or the root) were modified.
  - If a task matcher matches a path using relative matching outside of its workspace, eg, `match: '../other-module/**/*.ts'`, the task will be added to the run despite the workspace _not_ being modified.

- Moved worktree determination to before initial yargs building to ensure graph is working from the worktree instead of the main repo root. [#49](https://github.com/paularmstrong/onerepo/pull/49) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure when requesting `sudo` permissions that output is clear and gives enough context. [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`c1863ba`](https://github.com/paularmstrong/onerepo/commit/c1863ba8a30455b6b43530a91b15c00cb1881052), [`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`d502f2e`](https://github.com/paularmstrong/onerepo/commit/d502f2effe7c3448bc0143020778744ca71c5b1e), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`6431e8d`](https://github.com/paularmstrong/onerepo/commit/6431e8d33cba1304c0e275ce1c8eac4265c742b2), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`2f4e19e`](https://github.com/paularmstrong/onerepo/commit/2f4e19e1f798f34eb551bf17d7c91d4ca9d2b873), [`587b442`](https://github.com/paularmstrong/onerepo/commit/587b4425863c88487794622c6da95a0c4f3559ae), [`1293372`](https://github.com/paularmstrong/onerepo/commit/12933720aad9024d278fa2097ac4fac8bdab81eb), [`4f7433d`](https://github.com/paularmstrong/onerepo/commit/4f7433d9f8d6ee12d90a557d7639a8b2bf0c8b1f), [`126c514`](https://github.com/paularmstrong/onerepo/commit/126c5147d0bb2c4ed5bca2973dbce1ae3133cc3e), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`c7ffeaa`](https://github.com/paularmstrong/onerepo/commit/c7ffeaa844500c214bcd1d9782281cec73bf936a), [`0a3bb03`](https://github.com/paularmstrong/onerepo/commit/0a3bb03d0e33b2ac9505d43d9a2f0b87443e88f1), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b)]:
  - @onerepo/core@0.1.0
  - @onerepo/logger@0.0.1
  - @onerepo/subprocess@0.0.1
  - @onerepo/graph@0.1.0
  - @onerepo/git@0.0.1
  - @onerepo/file@0.0.1
  - @onerepo/builders@0.0.1
