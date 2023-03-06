# @onerepo/plugin-changesets

## 0.1.0

### Minor Changes

- - Reorder main command name to priorities `change` and primary. [#73](https://github.com/paularmstrong/onerepo/pull/73) ([@paularmstrong](https://github.com/paularmstrong))
  - Adds singular `changeset` to command aliases.
  - Rename `prepare` to `version`.

- Remove `--update-index` alias from `add` and `version` command option `--add`. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning workspaces for publishing, ensure the git working state is clean without changes. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- `prerelease` and `publish` will now run the standard `tasks` lifecycle `build` with the list of publishable workspaces. [#57](https://github.com/paularmstrong/onerepo/pull/57) ([@paularmstrong](https://github.com/paularmstrong))

- Add the new changeset to the git stage by default when running `changeset add`. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- Automatically add updated `package.json` and `CHANGELOG.md` files to the git index when versioning. [#80](https://github.com/paularmstrong/onerepo/pull/80) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Carry publishConfig.access over to NPM publish arguments to avoid access errors. [#103](https://github.com/paularmstrong/onerepo/pull/103) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning a workspace based on changesets, also forcefully select _dependencies_ and apply their changesets as well. This fixes a behavior where the _affected_ workspaces were selected, which is the opposite behavior we actually wanted here. [#80](https://github.com/paularmstrong/onerepo/pull/80) ([@paularmstrong](https://github.com/paularmstrong))

- Init must call `changeset` not `changesets` bin [#107](https://github.com/paularmstrong/onerepo/pull/107) ([@paularmstrong](https://github.com/paularmstrong))

- Don't attempt to build & publish during `changesets publish` if there are no publishable workspaces. [#129](https://github.com/paularmstrong/onerepo/pull/129) ([@paularmstrong](https://github.com/paularmstrong))

- When versioning workspaces, check for other workspaces not in the list of those selected for release. If there are more that need to be added outside of the direct dependency chain, warn the user and confirm okay to continue including those workspaces as well. [#119](https://github.com/paularmstrong/onerepo/pull/119) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))

- Only add the expected files and filter out changelots on private workspaces to prevent git updateIndex from throwing an error. [#118](https://github.com/paularmstrong/onerepo/pull/118) ([@paularmstrong](https://github.com/paularmstrong))

- When looking for modified files, merge the current status along with the diff-tree from merge-base. This mostly affects plugin-changesets when running `changsets add` in that adding multiple changesets in a single command will continue to show all affected workspaces each time, regardless of uncommitted status. [#62](https://github.com/paularmstrong/onerepo/pull/62) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure prepare includes the changesets in the releasePlan, otherwise nothing will be assembled for applying. [#48](https://github.com/paularmstrong/onerepo/pull/48) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6665501`](https://github.com/paularmstrong/onerepo/commit/66655015d6285b754a69fa9e453d81506de883f0), [`04c28b2`](https://github.com/paularmstrong/onerepo/commit/04c28b21b90a2f3306ecb2daacb81f59cadc9bdc), [`65a63cf`](https://github.com/paularmstrong/onerepo/commit/65a63cf5783df271a569d1e62258e389c723b56b)]:
  - @onerepo/subprocess@0.0.1
  - @onerepo/file@0.0.1
