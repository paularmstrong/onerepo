# @onerepo/git

## 0.0.1

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- When looking for modified files, merge the current status along with the diff-tree from merge-base. This mostly affects plugin-changesets when running `changsets add` in that adding multiple changesets in a single command will continue to show all affected workspaces each time, regardless of uncommitted status. [#62](https://github.com/paularmstrong/onerepo/pull/62) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b), [`831ea55`](https://github.com/paularmstrong/onerepo/commit/831ea556d8fa8cd86b31217af894e4bf941cb0d5), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc)]:
  - @onerepo/logger@0.0.1
  - @onerepo/subprocess@0.0.1
