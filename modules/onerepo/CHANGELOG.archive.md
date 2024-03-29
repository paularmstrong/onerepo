# onerepo

## 1.0.0

### Dependencies updated

- @onerepo/test-cli@1.0.0
- @onerepo/yargs@1.0.0
- @onerepo/builders@1.0.0
- @onerepo/git@1.0.0
- @onerepo/graph@1.0.0
- @onerepo/package-manager@1.0.0
- @onerepo/subprocess@1.0.0
- @onerepo/file@1.0.0
- @onerepo/logger@1.0.0

> View the full changelog: [99a9330...99a9330](https://github.com/paularmstrong/onerepo/compare/99a9330aa19a1faf8e3b12e64cfede44ab0737b1...99a9330aa19a1faf8e3b12e64cfede44ab0737b1)

## 1.0.0-beta.3

### Minor changes

- Removes special handling for the now removed plugin `@onerepo/plugin-changesets`. ([c7ddbe9](https://github.com/paularmstrong/onerepo/commit/c7ddbe9fdd3369f3208eae11ab714efcbad43ea2))

### Patch changes

- Incorrect reading and writing `pnpm-workspace.yaml` files ([141772b](https://github.com/paularmstrong/onerepo/commit/141772b8f42c43db72a9ab2c1b58168bc7557a33))

### Dependencies updated

- @onerepo/test-cli@1.0.0-beta.3
- @onerepo/yargs@1.0.0-beta.3
- @onerepo/builders@1.0.0-beta.3
- @onerepo/git@1.0.0-beta.3
- @onerepo/graph@1.0.0-beta.3
- @onerepo/package-manager@1.0.0-beta.3
- @onerepo/subprocess@1.0.0-beta.3
- @onerepo/file@1.0.0-beta.3
- @onerepo/logger@1.0.0-beta.3

> View the full changelog: [3422ce3...c7ddbe9](https://github.com/paularmstrong/onerepo/compare/3422ce36a1c9dc12116c814b132a010e9a4ce286...c7ddbe9fdd3369f3208eae11ab714efcbad43ea2)

## 1.0.0-beta.2

### Patch changes

- Fixes global install from npx/yarn dlx/pnpm dlx. ([7c9771d](https://github.com/paularmstrong/onerepo/commit/7c9771d2222de817a5f5f4a0ce76551bbc35525b))

### Dependencies updated

- @onerepo/test-cli@1.0.0-beta.2
- @onerepo/yargs@1.0.0-beta.2
- @onerepo/builders@1.0.0-beta.2
- @onerepo/git@1.0.0-beta.2
- @onerepo/graph@1.0.0-beta.2
- @onerepo/package-manager@1.0.0-beta.2
- @onerepo/subprocess@1.0.0-beta.2
- @onerepo/file@1.0.0-beta.2
- @onerepo/logger@1.0.0-beta.2

> View the full changelog: [f254b59...9a4b991](https://github.com/paularmstrong/onerepo/compare/f254b59fefa44171397966c8913d3283fa2d0b0b...9a4b991c73b215c2ce440b7c4817e5c3a0e638e2)

## 1.0.0-beta.1

### Minor changes

- `git.updateIndex()` requires either passing the option `immediately: true` or calling `git.flushUpdateIndex()` afterwards in order to actually write to the git index. ([876e3e7](https://github.com/paularmstrong/onerepo/commit/876e3e71b64390472a3b91f2f554085b29ad2dd5))
  This process is designed to avoid race conditions from parallel calls which could cause git to become in a bad state, requiring users manually delete their `.git/index.lock` file.
  > Note: you should not normally need to make any changes to account for this. oneRepo commands will automatically call `flushUpdateIndex()` as necessary during shutdown.
- Adds option `maxParallel` to `batch()` processes to manually control the maximum number of parallel subprocesses to run. This number will still be limited by the number of CPU cores available. ([483d7c0](https://github.com/paularmstrong/onerepo/commit/483d7c000ca69f094a43797f05e8f0432e2a5d70))

### Patch changes

- Cancelling `tasks` should no longer result in conflicted `.git/index.lock` files when shut down while trying to add files to the git index/stage. ([876e3e7](https://github.com/paularmstrong/onerepo/commit/876e3e71b64390472a3b91f2f554085b29ad2dd5))
- Removes unnecessary info output when running `one graph show` ([442eafd](https://github.com/paularmstrong/onerepo/commit/442eafda8966ade466ed797859249386cf867cae))
- Type documentation updates ([0ef3a1b](https://github.com/paularmstrong/onerepo/commit/0ef3a1b414c3a34aaaab8d7a6400bb36430be152))
- Prevents auto-adding `latest` as the dist-tag when publishing workspaces when their versions have pre-release suffixes. ([483d7c0](https://github.com/paularmstrong/onerepo/commit/483d7c000ca69f094a43797f05e8f0432e2a5d70))

### Dependencies updated

- @onerepo/test-cli@1.0.0-beta.1
- @onerepo/yargs@1.0.0-beta.1
- @onerepo/builders@1.0.0-beta.1
- @onerepo/git@1.0.0-beta.1
- @onerepo/graph@1.0.0-beta.1
- @onerepo/package-manager@1.0.0-beta.1
- @onerepo/subprocess@1.0.0-beta.1
- @onerepo/file@1.0.0-beta.1
- @onerepo/logger@1.0.0-beta.1

> View the full changelog: [c9304db...92d39f9](https://github.com/paularmstrong/onerepo/compare/c9304dbcfeaa10ec01a76c3057cfef66188cb428...92d39f9980e2489a25c168f722a6326ab9938b80)

## 1.0.0-beta.0

### Major changes

- Triggering major release… ([1525cc1](https://github.com/paularmstrong/onerepo/commit/1525cc1e51b571bc86ed4dbfd71864217881ff88))

### Patch changes

- Dev dependency updates ([a96e6d5](https://github.com/paularmstrong/onerepo/commit/a96e6d552678239ea4b82b39130a002329b256d5))
- Updated internal types dependencies. ([de04ab8](https://github.com/paularmstrong/onerepo/commit/de04ab877c4e04f43ada5383a89c040f678475a2))

### Dependencies updated

- @onerepo/test-cli@1.0.0-beta.0
- @onerepo/yargs@1.0.0-beta.0
- @onerepo/builders@1.0.0-beta.0
- @onerepo/git@1.0.0-beta.0
- @onerepo/graph@1.0.0-beta.0
- @onerepo/package-manager@1.0.0-beta.0
- @onerepo/subprocess@1.0.0-beta.0
- @onerepo/file@1.0.0-beta.0
- @onerepo/logger@1.0.0-beta.0

> View the full changelog: [78c3762...1525cc1](https://github.com/paularmstrong/onerepo/compare/78c37627cffe8d026958ec949eda9ab0d9c29cf8...1525cc1e51b571bc86ed4dbfd71864217881ff88)

## 0.17.0

### Minor changes

- Recommend possible commands when command is not found (for typos, etc). ([490d919](https://github.com/paularmstrong/onerepo/commit/490d919c51cc4353a8201813346a5bfe1cfaf357))
- Replaced the `--silent` flag with `--quiet`/`-q` for consistency across other CLIs. ([25f5d48](https://github.com/paularmstrong/onerepo/commit/25f5d48b56d46f5f9b83ada2c582d5ec2589b9ee))
- When installed to the global path, a shutdown check will run comparing the global vs local version. If there is a mismatch, a warning will be prominently displayed prompting to fix the issue. ([44cbb16](https://github.com/paularmstrong/onerepo/commit/44cbb16510f1d743c68d45af6f3dff32c7b617cf))
- Disallows adding production-level dependencies to the root Workspace. Prompts to change to devDependencies or exit. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Refactored internals for applying `package.json` `publishConfig` entries. Use `workspace.publishablePackageJson` to get a safe version of the Workspace's `package.json` file, ready for publishing. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Workspace-specific commands will require `workspace` or `ws` before the workspace name when running. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
  **Before:**
  ```sh
  one docs start
  ```
  **After:**
  ```sh
  one workspace docs start
  ```
- Added `passthrough` command ability to Workspace configurations. Use with caution. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Adds `file.readJson` to read and parse JSON files with the optional ability to support JSONC by stripping out comments and trailing commas ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- The oneRepo CLI will now automatically update node_modules using your repository's package manager whenever necessary, before running commands. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Logging an empty function will now execute and stringify the return value of the function. This will prevent expensive loops used to build up helpful information strings. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
  ```ts
  step.log(() => bigArray.map((item) => item.name));
  ```

### Patch changes

- Ensure the package manager's `install` command is run after versioning workspaces. ([5e203f5](https://github.com/paularmstrong/onerepo/commit/5e203f559b5aca1f45427729a59764d3a47952b5))
- `one change verify` will not fail if only `CHANGELOG.md` or `package.json`+`CHANGELOG.md` are modified. ([334eacc](https://github.com/paularmstrong/onerepo/commit/334eacc576ae41ae38e9b0a0e0af97d3f09a2f07))
- When versioning packages, ensure change entries are fully consumed (and deleted). ([e228db5](https://github.com/paularmstrong/onerepo/commit/e228db5b401f7dd63ca3aa381ef89e2adf9cfad4))
- Include `changes` commands in available local tasks passthrough commands. ([a0eb309](https://github.com/paularmstrong/onerepo/commit/a0eb309c6f96fc2f2769c1b7b320805b6d2a15dc))
- Correct CLI usage syntax in `--help` output. ([569a10e](https://github.com/paularmstrong/onerepo/commit/569a10e5678f280224bdc03fbc38b37fdaa096a5))
- Fixed bug in writing out URLs for visualizer in which they may end up truncated prematurely. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- When adding a dependency to the repository root, do not also add the dependency to every workspace. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))

### Dependencies updated

- @onerepo/test-cli@0.5.7
- @onerepo/yargs@0.7.0
- @onerepo/builders@0.5.7
- @onerepo/git@0.5.1
- @onerepo/graph@0.11.0
- @onerepo/package-manager@0.5.1
- @onerepo/subprocess@0.7.1
- @onerepo/file@0.7.0
- @onerepo/logger@0.7.0

> View the full changelog: [076da8f...5e203f5](https://github.com/paularmstrong/onerepo/compare/076da8f7e96c37fdbd5af4e6772778207073136d...5e203f559b5aca1f45427729a59764d3a47952b5)

## 0.16.0

### Minor Changes

- Setup and configuration has had a major change. [#509](https://github.com/paularmstrong/onerepo/pull/509) ([@paularmstrong](https://github.com/paularmstrong))

  - Run the following to install the `one` executable:

    ```sh
    npx --project=onerepo one install
    ```

  - Delete `/usr/local/bin/<your-executable-name>`. Executable name will always be `one` or `onerepo` (alias) from now on. You can create your own alias if desired, but it is not recommended.
  - Move configuration of `setup()` from `./bin/<your-executable>.mjs` to `onerepo.config.js`. See documentation for more information on setting up configurations.

- Added support for experimental graph visualizer to `one graph show`. [#548](https://github.com/paularmstrong/onerepo/pull/548) ([@paularmstrong](https://github.com/paularmstrong))

- Merged `create-onerepo` & `@onerepo/create` into `onerepo`. Usable now via `npx --project=onerepo one create`. [#509](https://github.com/paularmstrong/onerepo/pull/509) ([@paularmstrong](https://github.com/paularmstrong))

- Added code owners management. Define codeowners via the `codeowners` key in workspace configuration files. Works with GitHub, Gitlab, Gitea, and BitBucket. [#539](https://github.com/paularmstrong/onerepo/pull/539) ([@paularmstrong](https://github.com/paularmstrong))

  - `one codeowners sync` to sync for your hosting provider.
  - `one codeowners verify` to ensure the hosting provider file is up to date.

- Added git hook management, `one hooks init` and `one hooks create`. [#559](https://github.com/paularmstrong/onerepo/pull/559) ([@paularmstrong](https://github.com/paularmstrong))

- Added `--shard` argument to `one tasks` to shard tasks across multiple runners. [#534](https://github.com/paularmstrong/onerepo/pull/534) ([@paularmstrong](https://github.com/paularmstrong))

- `docgen` is now a separate plugin outside of the oneRepo core. [#512](https://github.com/paularmstrong/onerepo/pull/512) ([@paularmstrong](https://github.com/paularmstrong))

- Added a `--version` flag to output the current onerepo CLI version. [#531](https://github.com/paularmstrong/onerepo/pull/531) ([@paularmstrong](https://github.com/paularmstrong))

- Switched runtime from `esbuild-register` to `jiti` to avoid heavy dependencies and platform-specific requirements. [#513](https://github.com/paularmstrong/onerepo/pull/513) ([@paularmstrong](https://github.com/paularmstrong))

- Core commands no longer allow overriding the command name (`graph`, `tasks`, `generate`, and `install`). [#509](https://github.com/paularmstrong/onerepo/pull/509) ([@paularmstrong](https://github.com/paularmstrong))

- When a LogStep has not properly ended while its parent Logger is ended, a warning will be thrown in the step. [#562](https://github.com/paularmstrong/onerepo/pull/562) ([@paularmstrong](https://github.com/paularmstrong))

- Root configuration change to move `core` configuration options to clearer and more reusable locations. Please refer to the [full documentation](https://onerepo.tools/guides/config/) for help. [#550](https://github.com/paularmstrong/onerepo/pull/550) ([@paularmstrong](https://github.com/paularmstrong))

- Environment variable prefixes have been changed from `ONE_REPO_` to `ONEREPO_` for consistency. [#559](https://github.com/paularmstrong/onerepo/pull/559) ([@paularmstrong](https://github.com/paularmstrong))

- Potentially speed up package manager determination by using the `npm_config_user_agent` environment variable. [#510](https://github.com/paularmstrong/onerepo/pull/510) ([@paularmstrong](https://github.com/paularmstrong))

- Deprecated and merged `@onerepo/core` directly into the `onerepo` package. [#515](https://github.com/paularmstrong/onerepo/pull/515) ([@paularmstrong](https://github.com/paularmstrong))

- Added engines check to verify current node.js version with the range defined in the repo's root package.json. [`4c67f8b`](https://github.com/paularmstrong/onerepo/commit/4c67f8ba789f8bc79ea6962b1cd08c8c8f7305f4) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Streamlined step and info output for `tasks` [`9fbcb66`](https://github.com/paularmstrong/onerepo/commit/9fbcb666152051a84d46bee074cf489a0a11cc4d) ([@paularmstrong](https://github.com/paularmstrong))

- Unpausing the logger will now correctly resume the animated step output. [#509](https://github.com/paularmstrong/onerepo/pull/509) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`19049eb`](https://github.com/paularmstrong/onerepo/commit/19049ebd60f965c4ab8bdc16045ce2112ae35fc1), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`0de22b4`](https://github.com/paularmstrong/onerepo/commit/0de22b4cd25911794975cedb709e5c378c3982ae), [`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`154a2d1`](https://github.com/paularmstrong/onerepo/commit/154a2d151012f0c0c31831ab3ecab32ef6dc45ef), [`9dea7b0`](https://github.com/paularmstrong/onerepo/commit/9dea7b02ba2c8257714ae1b9d4235a0f7e5a0b75), [`4c67f8b`](https://github.com/paularmstrong/onerepo/commit/4c67f8ba789f8bc79ea6962b1cd08c8c8f7305f4)]:
  - @onerepo/file@0.6.0
  - @onerepo/subprocess@0.7.0
  - @onerepo/graph@0.10.0
  - @onerepo/logger@0.6.0
  - @onerepo/git@0.5.0
  - @onerepo/package-manager@0.5.0
  - @onerepo/yargs@0.6.0
  - @onerepo/builders@0.5.6

## 0.15.4

### Patch Changes

- Do not force checkout files if there are no partially staged files during task runs that use the git staging workflow. [#503](https://github.com/paularmstrong/onerepo/pull/503) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`fe49360`](https://github.com/paularmstrong/onerepo/commit/fe493603a99ee53c72c2785c6d7f316e9a0ba5e9), [`9b28949`](https://github.com/paularmstrong/onerepo/commit/9b28949f191e322171052ecd01074e646373bbf1)]:
  - @onerepo/core@0.14.4
  - @onerepo/git@0.4.4
  - @onerepo/graph@0.9.3
  - @onerepo/builders@0.5.5
  - @onerepo/yargs@0.5.6

## 0.15.3

### Patch Changes

- Fix reapplying unstaged changes when no tasks were run. [#501](https://github.com/paularmstrong/onerepo/pull/501) ([@paularmstrong](https://github.com/paularmstrong))

- Apply unstaged changes using a better merge strategy from the stash to ensure that even in the event of conflicts, the stash is applied before being dropped. [#501](https://github.com/paularmstrong/onerepo/pull/501) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6b30e32`](https://github.com/paularmstrong/onerepo/commit/6b30e32f3b52a7546ab210d3c3aec8bb2b166b61), [`6b30e32`](https://github.com/paularmstrong/onerepo/commit/6b30e32f3b52a7546ab210d3c3aec8bb2b166b61)]:
  - @onerepo/core@0.14.3
  - @onerepo/git@0.4.3
  - @onerepo/builders@0.5.4
  - @onerepo/yargs@0.5.5

## 0.15.2

### Patch Changes

- When running git staging workflow (eg, during `tasks -c pre-commit`), forcibly skip all git hooks, not just using HUSKY environment variables. [#499](https://github.com/paularmstrong/onerepo/pull/499) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`5a6faab`](https://github.com/paularmstrong/onerepo/commit/5a6faabc9ef4281d206315a5bc60b50b51a476c2)]:
  - @onerepo/core@0.14.2
  - @onerepo/git@0.4.2
  - @onerepo/builders@0.5.3
  - @onerepo/yargs@0.5.4

## 0.15.1

### Patch Changes

- Ensure Husky hooks are skipped during git checkout [#497](https://github.com/paularmstrong/onerepo/pull/497) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`0f3535a`](https://github.com/paularmstrong/onerepo/commit/0f3535a3d5302ebf7ac21f96325a6018add6acbd)]:
  - @onerepo/git@0.4.1
  - @onerepo/core@0.14.1
  - @onerepo/builders@0.5.2
  - @onerepo/yargs@0.5.3

## 0.15.0

### Minor Changes

- `batch()` now also accepts async/promise-based functions, as long as they will return a response of `[string, string]` (`[output, errorOutput]`). [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- `batch()` calls will preserve order of output to match the order of input specs, similar to `Promise.all()`. [#488](https://github.com/paularmstrong/onerepo/pull/488) ([@paularmstrong](https://github.com/paularmstrong))

- New `Logger` instances can be buffered to parent instance steps using `bufferSubLogger(step: LogStep)`. [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- It is possible to create more instances of `Logger`. The most recently created instance will be used for functions that require a logger from the global scope. [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- `tasks` will now stash any unstaged changes when running the `pre-commit` lifecycle and reapply them after completion. This option is configurable using the `stagedOnly` option on `core.tasks` in `setup()`. Alternatively, you can manually pass `--staged` to the command. [#476](https://github.com/paularmstrong/onerepo/pull/476) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Calls to logging methods on the default `logger` will no longer be dropped when intermixed between sub-steps. Output may come _after_ a step, depending on event loop timing. [#488](https://github.com/paularmstrong/onerepo/pull/488) ([@paularmstrong](https://github.com/paularmstrong))

- Worked around a bug in Yargs that prevented `--show-advanced` from showing hidden/advanced help documentation when used on sub-commands. [#447](https://github.com/paularmstrong/onerepo/pull/447) ([@paularmstrong](https://github.com/paularmstrong))

- When tasks run `one` commands, they are now run directly in the same process instead of spawned to a new process. This reduces run time for fast tasks significantly by removing file glob, yargs startup, and file parsing (& potentially compilation through esbuild). [#456](https://github.com/paularmstrong/onerepo/pull/456) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`3051ff2`](https://github.com/paularmstrong/onerepo/commit/3051ff25acc04a14343b48ae23f14a1ef3cf3326), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`14f6d4d`](https://github.com/paularmstrong/onerepo/commit/14f6d4d13a4e88fb52cf4ed168fda4eae3c5311d), [`218b130`](https://github.com/paularmstrong/onerepo/commit/218b130ba5b2c7223eb471e23bcdcfbabc6861b4), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`c06f55c`](https://github.com/paularmstrong/onerepo/commit/c06f55c0e1c09c257c0c607f0190221765695149), [`3051ff2`](https://github.com/paularmstrong/onerepo/commit/3051ff25acc04a14343b48ae23f14a1ef3cf3326)]:
  - @onerepo/git@0.4.0
  - @onerepo/logger@0.5.0
  - @onerepo/subprocess@0.6.0
  - @onerepo/core@0.14.0
  - @onerepo/yargs@0.5.2
  - @onerepo/builders@0.5.1
  - @onerepo/file@0.5.2
  - @onerepo/package-manager@0.4.2
  - @onerepo/graph@0.9.2

## 0.14.0

### Minor Changes

- Ignore `*.config.*` files in commands directories [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Removed `getters` export. All “getters” are available from `builders.getX`, where `X` is the TitleCase version of the original function, eg `getters.affected()` is now `builders.getAffected()`. Users are still encouraged to use the `HandlerExtra` provided variants instead. [#424](https://github.com/paularmstrong/onerepo/pull/424) ([@paularmstrong](https://github.com/paularmstrong))

- Include thematic breaks between commands for markdown generated from `docgen` [#451](https://github.com/paularmstrong/onerepo/pull/451) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Ability to set `logger.verbosity` to `0` via `getLogger()` method. [#428](https://github.com/paularmstrong/onerepo/pull/428) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed a bug where `one install` would fail due to spaces in the repository's file path. [`9b070c4`](https://github.com/paularmstrong/onerepo/commit/9b070c411c9c33cad8b48c84acb8d3dc37358f9f) ([@jakeleveroni](https://github.com/jakeleveroni))

- Add missing dependency, 'semver'. [#473](https://github.com/paularmstrong/onerepo/pull/473) ([@paularmstrong](https://github.com/paularmstrong))

- Prevent hard-failures during `docgen` when yargs methods are encountered that are not implemented in documentation generation. [#450](https://github.com/paularmstrong/onerepo/pull/450) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures path configuration options for core commands `docgen`, `generate`, and `graph` are relative to the repository root to ensure correct resolution across git worktrees. [#449](https://github.com/paularmstrong/onerepo/pull/449) ([@paularmstrong](https://github.com/paularmstrong))

- Minor updates to internal import methods [#430](https://github.com/paularmstrong/onerepo/pull/430) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7c11522`](https://github.com/paularmstrong/onerepo/commit/7c115223c1d29852528c402728c4921fdbecb2f8), [`9b070c4`](https://github.com/paularmstrong/onerepo/commit/9b070c411c9c33cad8b48c84acb8d3dc37358f9f), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c), [`894497a`](https://github.com/paularmstrong/onerepo/commit/894497aa07572f88e45135b5027a5bf18e83c7a9), [`e0b2745`](https://github.com/paularmstrong/onerepo/commit/e0b274538f33431edbaf04e461ce1f6dd5c1d521), [`a70d59e`](https://github.com/paularmstrong/onerepo/commit/a70d59e5996725cc74f60b43c42af4660a72d46e), [`a78a6bf`](https://github.com/paularmstrong/onerepo/commit/a78a6bf9d126de496c669cc19522897628ae912a), [`5b70d80`](https://github.com/paularmstrong/onerepo/commit/5b70d80b0af2a3d46719a81169308639b0fdfb81), [`28410b7`](https://github.com/paularmstrong/onerepo/commit/28410b7cfaeed011c7e01973acb041a7d3aa984c)]:
  - @onerepo/core@0.13.0
  - @onerepo/logger@0.4.1
  - @onerepo/builders@0.5.0
  - @onerepo/file@0.5.1
  - @onerepo/git@0.3.1
  - @onerepo/graph@0.9.1
  - @onerepo/package-manager@0.4.1
  - @onerepo/subprocess@0.5.1
  - @onerepo/yargs@0.5.1

## 0.13.0

### Minor Changes

- When run in GitHub workflows, log steps will be collapsed as grouped output for faster scanning and debugging. [#425](https://github.com/paularmstrong/onerepo/pull/425) ([@paularmstrong](https://github.com/paularmstrong))

- When run in GitHub workflows, `graph verify` will annotate files with errors. [#425](https://github.com/paularmstrong/onerepo/pull/425) ([@paularmstrong](https://github.com/paularmstrong))

- Increase support matrix for both Node ^18 and ^20. [#426](https://github.com/paularmstrong/onerepo/pull/426) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Logger verbosity is now explicitly number `0` through `5`. [#423](https://github.com/paularmstrong/onerepo/pull/423) ([@paularmstrong](https://github.com/paularmstrong))

- DRY-RUN information will now be written as INFO lines instead of warnings. [#423](https://github.com/paularmstrong/onerepo/pull/423) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`727304d`](https://github.com/paularmstrong/onerepo/commit/727304d014fd492eb51839faa3b5743db104d40f), [`6cb8819`](https://github.com/paularmstrong/onerepo/commit/6cb8819afb4e56f30629a6f6c06c57b0fc001cb4), [`045f173`](https://github.com/paularmstrong/onerepo/commit/045f173bf14acadf953d8e9de77b035659dec093), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b), [`3a9371c`](https://github.com/paularmstrong/onerepo/commit/3a9371cda959afc71c86d4b3593f7a9deef8e63b)]:
  - @onerepo/logger@0.4.0
  - @onerepo/core@0.12.0
  - @onerepo/builders@0.4.0
  - @onerepo/file@0.5.0
  - @onerepo/git@0.3.0
  - @onerepo/graph@0.9.0
  - @onerepo/package-manager@0.4.0
  - @onerepo/subprocess@0.5.0
  - @onerepo/yargs@0.5.0

## 0.12.0

### Minor Changes

- Added `packageManager.batch` for batching third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

- Added `packageManager.run` for running third party module bins, similar to `npm exec`. [#402](https://github.com/paularmstrong/onerepo/pull/402) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Attempt to recover from JSON parsing issues when determining publishable modules. [#399](https://github.com/paularmstrong/onerepo/pull/399) ([@paularmstrong](https://github.com/paularmstrong))

- Sequential tasks at the root level were not being forcefully included for all changes. [#405](https://github.com/paularmstrong/onerepo/pull/405) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed file `write`, `writeSafe`, and `format` when using prettier@2 in which prettier formatting would not be run at all. [#400](https://github.com/paularmstrong/onerepo/pull/400) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`71a61cf`](https://github.com/paularmstrong/onerepo/commit/71a61cf1582f1eee5d9cd16a6bf52de014c6cce5), [`01b478b`](https://github.com/paularmstrong/onerepo/commit/01b478b72be4c4f989788c1a987a08f5ac63eaff), [`873693d`](https://github.com/paularmstrong/onerepo/commit/873693da7c058c3bcc48554f8ccc794b6f335e8b), [`ab1866c`](https://github.com/paularmstrong/onerepo/commit/ab1866c4dedc04f912f6dad5a5b506af8394a41f), [`ebd9cfe`](https://github.com/paularmstrong/onerepo/commit/ebd9cfea826e17830d7878bec6a46a9a42e975d7)]:
  - @onerepo/core@0.11.0
  - @onerepo/graph@0.8.0
  - @onerepo/package-manager@0.3.0
  - @onerepo/file@0.4.1

## 0.11.0

### Minor Changes

- Changed plugin API `preHandler` and `postHandler` functions to `startup` and `shutdown` (with different arguments available). [#375](https://github.com/paularmstrong/onerepo/pull/375) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`1b8566d`](https://github.com/paularmstrong/onerepo/commit/1b8566d1ee4cca60cacd237c5891d57a834c491d)]:
  - @onerepo/core@0.10.0
  - @onerepo/yargs@0.4.0

## 0.10.0

### Minor Changes

- Added optional key `$required` to JSON schema validation via `graph verify` to mark files as required. If set to true and no files via the file glob are found in matching workspaces, an error will be logged and the command will fail. [#365](https://github.com/paularmstrong/onerepo/pull/365) ([@paularmstrong](https://github.com/paularmstrong))

- Overhauled performance logging. All marks are pairs that start with `onerepo_start_` and `onerepo_end_`. By default, these will be converted into [Node.js performance `measure` entries](https://nodejs.org/api/perf_hooks.html#class-performancemeasure) for use in your own telemetry implementation. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- No longer re-throws errors thrown from handlers. If an error is encountered, the process will still set the exit code (`1`), but will not crash the process to ensure cleanup and post-handlers are completed properly. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Using `getFilepaths` and `getters.getFilepaths` to return the list of affected filepaths now has a threshold. When the threshold is reached, the relative workspace locations for the affected files will be returned instead. This threshold can be configured via the getter options: `{ affectedThreshold: number }`. [#370](https://github.com/paularmstrong/onerepo/pull/370) ([@paularmstrong](https://github.com/paularmstrong))

- Allows custom schema validators for `graph verify` to be functions that return JSONSchema. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

  As a function, the schema accepts two arguments, `workspace` and `graph`:

  ```ts
  import type { graph } from 'onerepo';

  export default {
  	'**': {
  		'package.json': (workspace: graph.Workspace, graph: graph.Graph) => ({
  			type: 'object',
  			properties: {
  				repository: {
  					type: 'object',
  					properties: {
  						directory: {
  							type: 'string',
  							const: graph.root.relative(workspace.location),
  						},
  					},
  					required: ['directory'],
  				},
  			},
  			required: ['repository'],
  		}),
  	},
  };
  ```

### Patch Changes

- Fixed a regression that prevented the default logger from writing out any logs until after all steps were completed. [#368](https://github.com/paularmstrong/onerepo/pull/368) ([@paularmstrong](https://github.com/paularmstrong))

- Prevents "maximum call stack exceeded" in logging when attempting to dim output through picocolors [#342](https://github.com/paularmstrong/onerepo/pull/342) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures current environment variables are passed through to subprocesses (normally the default) when passing in extra custom environment variables. [#346](https://github.com/paularmstrong/onerepo/pull/346) ([@paularmstrong](https://github.com/paularmstrong))

  ```ts
  await run({
  	// ...
  	opts: {
  		// The following will be merged with `...process.env`
  		env: { MY_ENV_VAR: 'true' },
  	},
  });
  ```

- Clarified some documentation and improved linking in typedoc blocks. [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba) ([@paularmstrong](https://github.com/paularmstrong))

- Adjustments for using `logger` from the `HandlerExtras`. Commands no longer throw or return incorrectly when there are errors. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Subprocess `sudo` command will now respect `--dry-run` settings [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `repository.directory` to `package.json` so CHANGELOGs are picked up properly by npm, renovate, etc. [#347](https://github.com/paularmstrong/onerepo/pull/347) ([@paularmstrong](https://github.com/paularmstrong))

- Running `install` multiple times will no longer break tab-completions. [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

- Clarified usage of `logger` should be restricted to only the one that is given in `HandlerExtra` [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Does not apply regex substitues during `file.writeSafe` calls (will write out string literals for `$'`, `$\``, etc.) [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

## 0.9.0

### Minor Changes

- Added ability to have _sequential_ steps within both `parallel` and `serial` tasks by providing arrays of steps. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

  ```js
  /** @type import('onerepo').graph.TaskConfig */
  export default {
  	'example-parallel': {
  		parallel: ['echo "run separately"', ['echo "first"', 'echo "second"']],
  	},
  	'example-serial': {
  		serial: [['echo "first"', 'echo "second"'], 'echo "run separately"'],
  	},
  	'example-serial-with-match': {
  		serial: [{ cmd: ['echo "first"', 'echo "second"'], match: './**/*' }, 'echo "run separately"'],
  	},
  };
  ```

- `sequential` has been renamed in Task configs to `serial` in order to differentiate between what _should_ be run separately to what _must_ be run in an ordered manner. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646), [`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646)]:
  - @onerepo/core@0.8.0
  - @onerepo/graph@0.7.0

## 0.8.2

### Patch Changes

- Gracefully handle git merge-base lookups when the `--fork-point` becomes lost due to `git gc` [#295](https://github.com/paularmstrong/onerepo/pull/295) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7250772`](https://github.com/paularmstrong/onerepo/commit/72507722769e0f6a29acbab90b13ec495d4dea1f)]:
  - @onerepo/git@0.2.2
  - @onerepo/builders@0.2.2
  - @onerepo/core@0.7.2
  - @onerepo/yargs@0.2.2

## 0.8.1

### Patch Changes

- Fix issue on install where husky doesn't install due to missing file [#284](https://github.com/paularmstrong/onerepo/pull/284) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`a859289`](https://github.com/paularmstrong/onerepo/commit/a859289960f805b467496f56c1c4bf4054ce819a), [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/core@0.7.1
  - @onerepo/builders@0.2.1
  - @onerepo/file@0.3.1
  - @onerepo/git@0.2.1
  - @onerepo/graph@0.6.1
  - @onerepo/logger@0.2.1
  - @onerepo/package-manager@0.2.2
  - @onerepo/subprocess@0.3.1
  - @onerepo/yargs@0.2.1

## 0.8.0

### Minor Changes

- Task `match` can now be an array of glob strings. [#254](https://github.com/paularmstrong/onerepo/pull/254) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`9004117`](https://github.com/paularmstrong/onerepo/commit/900411775b115763adc383e328b77f7d24ae6209), [`d88f906`](https://github.com/paularmstrong/onerepo/commit/d88f906381b729f052f347d6b7ebcec9bf6a24cc)]:
  - @onerepo/graph@0.6.0
  - @onerepo/core@0.7.0

## 0.7.1

### Patch Changes

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7), [`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/graph@0.5.0
  - @onerepo/package-manager@0.2.1
  - @onerepo/core@0.6.1

## 0.7.0

### Minor Changes

- `git.getStatus()` has been removed in favor of `git.isClean()` and `git.getModifiedFiles` [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `name` and `description` options to template generation configs. [#201](https://github.com/paularmstrong/onerepo/pull/201) ([@paularmstrong](https://github.com/paularmstrong))

  ```js title=".onegen.js"
  export default {
  	name: 'Module',
  	description: 'A description for the module to generate',
  	prompts: [],
  };
  ```

  ```
   ┌ Get template
   └ ⠙
  ? Choose a template… (Use arrow keys)
  ❯ Command - Create a repo-local command
    Module - Create a shared workspace in modules/
    Plugin - Create a publishable oneRepo plugin
  ```

- `git.getModifiedFiles` will only return a list of files that have been modified – it is no longer a mapping of modification type. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- `builders.withAffected` now includes a `--staged` argument. When used with `--affected`, handler extras `getFilepaths` and `getWorkspaces` will only get files/workspaces based on the current git stage and ignore files that have not be added to the stage list. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Fixes `--silent` to ensure steps are not written when the terminal is TTY. [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures that `devDependencies` and `peerDependencies` are checked for semantic version intersections when running `graph verify`. [#215](https://github.com/paularmstrong/onerepo/pull/215) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- When getting modified files (`git.getModifiedFiles()` or HandlerExtra's `getFilepaths()`), only return the staged files if in a state with modified files. This prevents running `eslint`, `prettier`, and others across uncommitted files, especially in git `pre-commit` hooks. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`434f113`](https://github.com/paularmstrong/onerepo/commit/434f113be7d373ab5c14aa5e5e313201e4e00902), [`0fa0f63`](https://github.com/paularmstrong/onerepo/commit/0fa0f63e3eb6351489669953942c39c20910f881), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`758af90`](https://github.com/paularmstrong/onerepo/commit/758af906e8be186000a864b0e6a14fe791c535d2), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`0b97317`](https://github.com/paularmstrong/onerepo/commit/0b973175a0efdee303896de2a2713987527a8194), [`2c4e8b3`](https://github.com/paularmstrong/onerepo/commit/2c4e8b38a667792aeb6cf99a6b27c3cd40c853ac), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`687583e`](https://github.com/paularmstrong/onerepo/commit/687583ed707e875f7941f77192528865ab77ae35)]:
  - @onerepo/builders@0.2.0
  - @onerepo/core@0.6.0
  - @onerepo/file@0.3.0
  - @onerepo/git@0.2.0
  - @onerepo/graph@0.4.0
  - @onerepo/logger@0.2.0
  - @onerepo/package-manager@0.2.0
  - @onerepo/subprocess@0.3.0
  - @onerepo/yargs@0.2.0

## 0.6.0

### Minor Changes

- `@onerepo/plugin-docgen` has been moved to a core command. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

  As a core command it is faster and more reliable and will work across more setups.

- `docgen` no longer supports the `--bin` flag. It will automatically use the same configuration and setup from the current CLI. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

- Adds alias `-f` for `--format` to `graph show` [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`c6b1dd1`](https://github.com/paularmstrong/onerepo/commit/c6b1dd126629ce5f802c62ea716402796976e1b0), [`c6b1dd1`](https://github.com/paularmstrong/onerepo/commit/c6b1dd126629ce5f802c62ea716402796976e1b0), [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34), [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34)]:
  - @onerepo/core@0.5.0

## 0.5.0

### Minor Changes

- Adds CJSON (Commented JavaScript Object Notation) support to `one graph verify`. This opens the ability to check `tsconfig.json` and other cjson-supporting configurations without throwing errors when reading the files. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- CLI in-point is now recommended to be ESM-compatible [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

  Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

  ```js title="./bin/one.mjs"
  #!/usr/bin/env node
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import { setup } from 'onerepo';

  setup({
  	root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
  }).then(({ run }) => run());
  ```

  If using TypeScript, continue to use `esbuild-register`, but import `onerepo` modules and plugins before the `register()` call.

- Adds `graph.packageManager` to handle various common functions for interacting with the repository's package manager (Yarn, NPM, or PNPm), determining which to use automatically. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

- Updates `file.copy` to recursively copy directories. [#177](https://github.com/paularmstrong/onerepo/pull/177) ([@paularmstrong](https://github.com/paularmstrong))

- `generate` configurations no longer assume you are only generating workspaces. [#175](https://github.com/paularmstrong/onerepo/pull/175) ([@paularmstrong](https://github.com/paularmstrong))

  - `nameFormat` and `dirnameFormat` options have been removed and you will need to add a prompt for `name` or any other variable that should be rendered into EJS templates.
  - `__name__` replacement in filenames has been replaced with EJS templating. Use `<%- name %>` instead.
  - `outDir` is now required to be a function and will be passed any variables from the input prompts for generating. Example: `outDir: ({ name }) => path.join(__dirname, '..', '..', 'modules', name),`

  To replicate the `name` and `nameFormat` options, you can use the following prompt:

  ```js
  const path = require('path');

  module.exports = {
  	outDir: ({ name }) => path.join(__dirname, '..', '..', '..', 'modules', name),
  	prompts: [
  		{
  			name: 'name',
  			message: 'What is the name of the workspace?',
  			suffix: ' @scope/',
  			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  		},
  	],
  };
  ```

- Adds JS/TS configuration validation support to `one graph verify`. This allows checking files like `jest.config.js` or `vite.config.ts` for minimum requirements across your workspaces and ensure they're kept up to date as your projects and infrastructure evolve. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- Adds YAML support to `one graph verify`. This opens the ability to check common yaml configuration files that apps in your monorepo depend on to ensure minimum standards are set and kept up to date. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- After running `one generate` and any file created from the template is a `package.json`, the command will run the package manager’s `install` command before exiting. [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

- CLI `setup()` will now use `esbuild-register` automatically. Users should not need to set any runtime interpreter manually and can safely remove this previous requirement if already in place. [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Error output from `graph verify` against schema will more clearly explain which file(s) include which error(s). [#184](https://github.com/paularmstrong/onerepo/pull/184) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed log output including too many newlines. [`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5) ([@paularmstrong](https://github.com/paularmstrong))

- Prevents running affected workspaces in `tasks` when `--no-affected` is explicitly passed to the command. [#182](https://github.com/paularmstrong/onerepo/pull/182) ([@paularmstrong](https://github.com/paularmstrong))

- Prevent aliases from being reused across workspaces. [#161](https://github.com/paularmstrong/onerepo/pull/161) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed interleaving root logger output between steps [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`9ebb136`](https://github.com/paularmstrong/onerepo/commit/9ebb1368e33e45a8ad56c92f5bb4110e305e54c3), [`be8b645`](https://github.com/paularmstrong/onerepo/commit/be8b645403399370d25aeb53d25067a03a968969), [`36acaa6`](https://github.com/paularmstrong/onerepo/commit/36acaa6e6a02a3f2fd5b7dcd08127b8fe7ac8398), [`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`c1827fe`](https://github.com/paularmstrong/onerepo/commit/c1827fe2232bdde970865aa0edaa391f929a0954), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`ac93c89`](https://github.com/paularmstrong/onerepo/commit/ac93c898da6d59ee3e161b27e17c4785c28b1b39), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`38836d8`](https://github.com/paularmstrong/onerepo/commit/38836d85df015c31470fd85a04f6ef014000afff), [`68018fe`](https://github.com/paularmstrong/onerepo/commit/68018fe439e6ce7bbbd12c71d8662779692a66d4), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`2fb7823`](https://github.com/paularmstrong/onerepo/commit/2fb7823fabee5baf9318b9a31b1288f68c4a3d35), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/core@0.4.0
  - @onerepo/package-manager@0.1.0
  - @onerepo/logger@0.1.1
  - @onerepo/graph@0.3.0
  - @onerepo/file@0.2.0
  - @onerepo/builders@0.1.1
  - @onerepo/git@0.1.1
  - @onerepo/subprocess@0.2.1
  - @onerepo/yargs@0.1.2

## 0.4.0

### Minor Changes

- Support optional `nameFormat` and `dirnameFormat` for generate config [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

### Patch Changes

- Support dotfiles when running generate [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

- Updated dependencies [[`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6), [`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6)]:
  - @onerepo/core@0.3.0

## 0.3.1

### Patch Changes

- Fixes issue with `install` not completing due to missing tab-completions. [#152](https://github.com/paularmstrong/onerepo/pull/152) ([@paularmstrong](https://github.com/paularmstrong))

- When the working directory is a workspace and the user prompts for `--help`, an error would be thrown looking for the `subcommandDir` if it did not exist. We now check for the existence of said directory before attempting to add commands to the yargs app, preventing throwing an error during help generation. [#149](https://github.com/paularmstrong/onerepo/pull/149) ([@paularmstrong](https://github.com/paularmstrong))

- Updates to `glob@9` during workspace and file globbing operations. [#145](https://github.com/paularmstrong/onerepo/pull/145) ([@paularmstrong](https://github.com/paularmstrong))

- Allow command `description` to be `false`. There are times when a command should remain undocumented and hidden from general use and this is how Yargs allows doing so. [#142](https://github.com/paularmstrong/onerepo/pull/142) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`e279809`](https://github.com/paularmstrong/onerepo/commit/e279809fcac4be0fe3d7622f3d2c7cca70d568d2), [`54abe47`](https://github.com/paularmstrong/onerepo/commit/54abe47ebe1eae9c6e70ea344b099b05b63621e2), [`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136), [`248af36`](https://github.com/paularmstrong/onerepo/commit/248af36e324824ec9587190e73ea7fe03bc955f3)]:
  - @onerepo/core@0.2.1
  - @onerepo/graph@0.2.1
  - @onerepo/yargs@0.1.1

## 0.3.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/core@0.2.0
  - @onerepo/file@0.1.0
  - @onerepo/git@0.1.0
  - @onerepo/graph@0.2.0
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0
  - @onerepo/yargs@0.1.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1
  - @onerepo/core@0.1.2
  - @onerepo/git@0.0.3

## 0.2.0

### Minor Changes

- When running a `batch()` process, if there are only 2-CPUs available, use both CPUs instead of `cpus.length - 1`. While we normally encourage using one less than available to avoid locking up the main processes, it should still be faster to spawn a separate process to the same CPU than to do all tasks synchronously. [#132](https://github.com/paularmstrong/onerepo/pull/132) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/builders@0.0.2
  - @onerepo/core@0.1.1
  - @onerepo/file@0.0.2
  - @onerepo/git@0.0.2
  - @onerepo/graph@0.1.1
  - @onerepo/logger@0.0.2

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
    `, `$\``, etc.) [#324](https://github.com/paularmstrong/onerepo/pull/324) ([@paularmstrong](https://github.com/paularmstrong))

- Writing files that support prettier can be done with ^2 or ^3. Prettier is now a peerDependency and if omitted, files will not be formatted when writing. [#373](https://github.com/paularmstrong/onerepo/pull/373) ([@paularmstrong](https://github.com/paularmstrong))

- Allows passing in a custom stream to override writing to `process.stderr`. Mostly useful for dependency injection during testing. [#366](https://github.com/paularmstrong/onerepo/pull/366) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures the logger closes all timers and file descriptors. [#372](https://github.com/paularmstrong/onerepo/pull/372) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`4d662c8`](https://github.com/paularmstrong/onerepo/commit/4d662c88427e0604f04e4e721b668290475e28e4), [`c0ac47f`](https://github.com/paularmstrong/onerepo/commit/c0ac47f0e67c95ccdcb89de7cdf9a185cd8e70c7), [`9035e6f`](https://github.com/paularmstrong/onerepo/commit/9035e6f8281a19cc33e2b4ae41bea46acee94a3d), [`eaaeac2`](https://github.com/paularmstrong/onerepo/commit/eaaeac257d06164adb3df11f454302c1ef2da2ba), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`4b845a5`](https://github.com/paularmstrong/onerepo/commit/4b845a52b009ce94cf021d2c6dd760d944a249cd), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`26d2eed`](https://github.com/paularmstrong/onerepo/commit/26d2eed3c38e8d6d9b7a407a4b09a76efd608f43), [`47bd7ae`](https://github.com/paularmstrong/onerepo/commit/47bd7ae880134110a5df430a46f7be823896417d), [`772a27d`](https://github.com/paularmstrong/onerepo/commit/772a27d1e4f97565bb7d568b3e063b14733c29f7), [`97eb0fe`](https://github.com/paularmstrong/onerepo/commit/97eb0fe489425b82a6ef566ecf8920be1801e474), [`63ada57`](https://github.com/paularmstrong/onerepo/commit/63ada577da7e630e127dcb0fe44523e55fa61840), [`a0e863e`](https://github.com/paularmstrong/onerepo/commit/a0e863e4bc9c92baa8c4f8af5c138cf989e555e3)]:
  - @onerepo/logger@0.3.0
  - @onerepo/core@0.9.0
  - @onerepo/subprocess@0.4.0
  - @onerepo/builders@0.3.0
  - @onerepo/file@0.4.0
  - @onerepo/git@0.2.3
  - @onerepo/graph@0.7.1
  - @onerepo/package-manager@0.2.3
  - @onerepo/yargs@0.3.0

## 0.9.0

### Minor Changes

- Added ability to have _sequential_ steps within both `parallel` and `serial` tasks by providing arrays of steps. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

  ```js
  /** @type import('onerepo').graph.TaskConfig */
  export default {
  	'example-parallel': {
  		parallel: ['echo "run separately"', ['echo "first"', 'echo "second"']],
  	},
  	'example-serial': {
  		serial: [['echo "first"', 'echo "second"'], 'echo "run separately"'],
  	},
  	'example-serial-with-match': {
  		serial: [{ cmd: ['echo "first"', 'echo "second"'], match: './**/*' }, 'echo "run separately"'],
  	},
  };
  ```

- `sequential` has been renamed in Task configs to `serial` in order to differentiate between what _should_ be run separately to what _must_ be run in an ordered manner. [#298](https://github.com/paularmstrong/onerepo/pull/298) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646), [`23f830c`](https://github.com/paularmstrong/onerepo/commit/23f830cd9632c65ae507d740bb7ceb7415961646)]:
  - @onerepo/core@0.8.0
  - @onerepo/graph@0.7.0

## 0.8.2

### Patch Changes

- Gracefully handle git merge-base lookups when the `--fork-point` becomes lost due to `git gc` [#295](https://github.com/paularmstrong/onerepo/pull/295) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`7250772`](https://github.com/paularmstrong/onerepo/commit/72507722769e0f6a29acbab90b13ec495d4dea1f)]:
  - @onerepo/git@0.2.2
  - @onerepo/builders@0.2.2
  - @onerepo/core@0.7.2
  - @onerepo/yargs@0.2.2

## 0.8.1

### Patch Changes

- Fix issue on install where husky doesn't install due to missing file [#284](https://github.com/paularmstrong/onerepo/pull/284) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`a859289`](https://github.com/paularmstrong/onerepo/commit/a859289960f805b467496f56c1c4bf4054ce819a), [`f434ba5`](https://github.com/paularmstrong/onerepo/commit/f434ba58f4d3de366697d367449440320d0a12a7)]:
  - @onerepo/core@0.7.1
  - @onerepo/builders@0.2.1
  - @onerepo/file@0.3.1
  - @onerepo/git@0.2.1
  - @onerepo/graph@0.6.1
  - @onerepo/logger@0.2.1
  - @onerepo/package-manager@0.2.2
  - @onerepo/subprocess@0.3.1
  - @onerepo/yargs@0.2.1

## 0.8.0

### Minor Changes

- Task `match` can now be an array of glob strings. [#254](https://github.com/paularmstrong/onerepo/pull/254) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`9004117`](https://github.com/paularmstrong/onerepo/commit/900411775b115763adc383e328b77f7d24ae6209), [`d88f906`](https://github.com/paularmstrong/onerepo/commit/d88f906381b729f052f347d6b7ebcec9bf6a24cc)]:
  - @onerepo/graph@0.6.0
  - @onerepo/core@0.7.0

## 0.7.1

### Patch Changes

- Updated dependencies [[`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7), [`c556124`](https://github.com/paularmstrong/onerepo/commit/c5561241be974c39349e8e3181ff3a38902bf8d7)]:
  - @onerepo/graph@0.5.0
  - @onerepo/package-manager@0.2.1
  - @onerepo/core@0.6.1

## 0.7.0

### Minor Changes

- `git.getStatus()` has been removed in favor of `git.isClean()` and `git.getModifiedFiles` [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Dropped Node 16 support. [#217](https://github.com/paularmstrong/onerepo/pull/217) ([@paularmstrong](https://github.com/paularmstrong))

- Adds `name` and `description` options to template generation configs. [#201](https://github.com/paularmstrong/onerepo/pull/201) ([@paularmstrong](https://github.com/paularmstrong))

  ```js title=".onegen.js"
  export default {
  	name: 'Module',
  	description: 'A description for the module to generate',
  	prompts: [],
  };
  ```

  ```
   ┌ Get template
   └ ⠙
  ? Choose a template… (Use arrow keys)
  ❯ Command - Create a repo-local command
    Module - Create a shared workspace in modules/
    Plugin - Create a publishable oneRepo plugin
  ```

- `git.getModifiedFiles` will only return a list of files that have been modified – it is no longer a mapping of modification type. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- `builders.withAffected` now includes a `--staged` argument. When used with `--affected`, handler extras `getFilepaths` and `getWorkspaces` will only get files/workspaces based on the current git stage and ignore files that have not be added to the stage list. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Reduced duplicative files built to the published modules. [`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b) ([@paularmstrong](https://github.com/paularmstrong))

- Fixes `--silent` to ensure steps are not written when the terminal is TTY. [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1) ([@paularmstrong](https://github.com/paularmstrong))

- Ensures that `devDependencies` and `peerDependencies` are checked for semantic version intersections when running `graph verify`. [#215](https://github.com/paularmstrong/onerepo/pull/215) ([@paularmstrong](https://github.com/paularmstrong))

- Typedefs for test files are now excluded from build & published modules. [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9) ([@paularmstrong](https://github.com/paularmstrong))

- When getting modified files (`git.getModifiedFiles()` or HandlerExtra's `getFilepaths()`), only return the staged files if in a state with modified files. This prevents running `eslint`, `prettier`, and others across uncommitted files, especially in git `pre-commit` hooks. [#200](https://github.com/paularmstrong/onerepo/pull/200) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`71f7ead`](https://github.com/paularmstrong/onerepo/commit/71f7eadc31effa5e92cb499efff8fe8317f7c01b), [`434f113`](https://github.com/paularmstrong/onerepo/commit/434f113be7d373ab5c14aa5e5e313201e4e00902), [`0fa0f63`](https://github.com/paularmstrong/onerepo/commit/0fa0f63e3eb6351489669953942c39c20910f881), [`25a09e1`](https://github.com/paularmstrong/onerepo/commit/25a09e1db45158a7a0576193ab2eac254fbe09e1), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`758af90`](https://github.com/paularmstrong/onerepo/commit/758af906e8be186000a864b0e6a14fe791c535d2), [`7f43b8d`](https://github.com/paularmstrong/onerepo/commit/7f43b8d0682917a1cca9f80d9c2ece7b58cfe4b9), [`10d66a9`](https://github.com/paularmstrong/onerepo/commit/10d66a9b93d6824a89915aa6e1ff3feeebcad91b), [`0b97317`](https://github.com/paularmstrong/onerepo/commit/0b973175a0efdee303896de2a2713987527a8194), [`2c4e8b3`](https://github.com/paularmstrong/onerepo/commit/2c4e8b38a667792aeb6cf99a6b27c3cd40c853ac), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`27e3398`](https://github.com/paularmstrong/onerepo/commit/27e3398383e300293938b3a0154315b0ad887f89), [`687583e`](https://github.com/paularmstrong/onerepo/commit/687583ed707e875f7941f77192528865ab77ae35)]:
  - @onerepo/builders@0.2.0
  - @onerepo/core@0.6.0
  - @onerepo/file@0.3.0
  - @onerepo/git@0.2.0
  - @onerepo/graph@0.4.0
  - @onerepo/logger@0.2.0
  - @onerepo/package-manager@0.2.0
  - @onerepo/subprocess@0.3.0
  - @onerepo/yargs@0.2.0

## 0.6.0

### Minor Changes

- `@onerepo/plugin-docgen` has been moved to a core command. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

  As a core command it is faster and more reliable and will work across more setups.

- `docgen` no longer supports the `--bin` flag. It will automatically use the same configuration and setup from the current CLI. [#198](https://github.com/paularmstrong/onerepo/pull/198) ([@paularmstrong](https://github.com/paularmstrong))

- Adds alias `-f` for `--format` to `graph show` [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`c6b1dd1`](https://github.com/paularmstrong/onerepo/commit/c6b1dd126629ce5f802c62ea716402796976e1b0), [`c6b1dd1`](https://github.com/paularmstrong/onerepo/commit/c6b1dd126629ce5f802c62ea716402796976e1b0), [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34), [`ee325f1`](https://github.com/paularmstrong/onerepo/commit/ee325f18c3fc484f8db778846391069f0fd17b34)]:
  - @onerepo/core@0.5.0

## 0.5.0

### Minor Changes

- Adds CJSON (Commented JavaScript Object Notation) support to `one graph verify`. This opens the ability to check `tsconfig.json` and other cjson-supporting configurations without throwing errors when reading the files. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- CLI in-point is now recommended to be ESM-compatible [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

  Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

  ```js title="./bin/one.mjs"
  #!/usr/bin/env node
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';
  import { setup } from 'onerepo';

  setup({
  	root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
  }).then(({ run }) => run());
  ```

  If using TypeScript, continue to use `esbuild-register`, but import `onerepo` modules and plugins before the `register()` call.

- Adds `graph.packageManager` to handle various common functions for interacting with the repository's package manager (Yarn, NPM, or PNPm), determining which to use automatically. [#178](https://github.com/paularmstrong/onerepo/pull/178) ([@paularmstrong](https://github.com/paularmstrong))

- Updates `file.copy` to recursively copy directories. [#177](https://github.com/paularmstrong/onerepo/pull/177) ([@paularmstrong](https://github.com/paularmstrong))

- `generate` configurations no longer assume you are only generating workspaces. [#175](https://github.com/paularmstrong/onerepo/pull/175) ([@paularmstrong](https://github.com/paularmstrong))

  - `nameFormat` and `dirnameFormat` options have been removed and you will need to add a prompt for `name` or any other variable that should be rendered into EJS templates.
  - `__name__` replacement in filenames has been replaced with EJS templating. Use `<%- name %>` instead.
  - `outDir` is now required to be a function and will be passed any variables from the input prompts for generating. Example: `outDir: ({ name }) => path.join(__dirname, '..', '..', 'modules', name),`

  To replicate the `name` and `nameFormat` options, you can use the following prompt:

  ```js
  const path = require('path');

  module.exports = {
  	outDir: ({ name }) => path.join(__dirname, '..', '..', '..', 'modules', name),
  	prompts: [
  		{
  			name: 'name',
  			message: 'What is the name of the workspace?',
  			suffix: ' @scope/',
  			filter: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  			transformer: (name) => name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase(),
  		},
  	],
  };
  ```

- Adds JS/TS configuration validation support to `one graph verify`. This allows checking files like `jest.config.js` or `vite.config.ts` for minimum requirements across your workspaces and ensure they're kept up to date as your projects and infrastructure evolve. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- Adds YAML support to `one graph verify`. This opens the ability to check common yaml configuration files that apps in your monorepo depend on to ensure minimum standards are set and kept up to date. [#157](https://github.com/paularmstrong/onerepo/pull/157) ([@paularmstrong](https://github.com/paularmstrong))

- After running `one generate` and any file created from the template is a `package.json`, the command will run the package manager’s `install` command before exiting. [#181](https://github.com/paularmstrong/onerepo/pull/181) ([@paularmstrong](https://github.com/paularmstrong))

- CLI `setup()` will now use `esbuild-register` automatically. Users should not need to set any runtime interpreter manually and can safely remove this previous requirement if already in place. [#159](https://github.com/paularmstrong/onerepo/pull/159) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Error output from `graph verify` against schema will more clearly explain which file(s) include which error(s). [#184](https://github.com/paularmstrong/onerepo/pull/184) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed log output including too many newlines. [`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5) ([@paularmstrong](https://github.com/paularmstrong))

- Prevents running affected workspaces in `tasks` when `--no-affected` is explicitly passed to the command. [#182](https://github.com/paularmstrong/onerepo/pull/182) ([@paularmstrong](https://github.com/paularmstrong))

- Prevent aliases from being reused across workspaces. [#161](https://github.com/paularmstrong/onerepo/pull/161) ([@paularmstrong](https://github.com/paularmstrong))

- Fixed interleaving root logger output between steps [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`9ebb136`](https://github.com/paularmstrong/onerepo/commit/9ebb1368e33e45a8ad56c92f5bb4110e305e54c3), [`be8b645`](https://github.com/paularmstrong/onerepo/commit/be8b645403399370d25aeb53d25067a03a968969), [`36acaa6`](https://github.com/paularmstrong/onerepo/commit/36acaa6e6a02a3f2fd5b7dcd08127b8fe7ac8398), [`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`c672384`](https://github.com/paularmstrong/onerepo/commit/c67238471572e95d1754050787d719c3f847b1c5), [`c1827fe`](https://github.com/paularmstrong/onerepo/commit/c1827fe2232bdde970865aa0edaa391f929a0954), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`ac93c89`](https://github.com/paularmstrong/onerepo/commit/ac93c898da6d59ee3e161b27e17c4785c28b1b39), [`5445d81`](https://github.com/paularmstrong/onerepo/commit/5445d81d8ba77b5cf93aec23b21eb4d281b01985), [`38836d8`](https://github.com/paularmstrong/onerepo/commit/38836d85df015c31470fd85a04f6ef014000afff), [`68018fe`](https://github.com/paularmstrong/onerepo/commit/68018fe439e6ce7bbbd12c71d8662779692a66d4), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`f2b3d66`](https://github.com/paularmstrong/onerepo/commit/f2b3d66008d4a91ce2c418a8c4bee37e8beec473), [`7e4451a`](https://github.com/paularmstrong/onerepo/commit/7e4451a69916c4dfe18cbb6a9ae3a51f6ee8e3fc), [`2fb7823`](https://github.com/paularmstrong/onerepo/commit/2fb7823fabee5baf9318b9a31b1288f68c4a3d35), [`123df73`](https://github.com/paularmstrong/onerepo/commit/123df73f71f4d2ad199c4a933364f8a4d38263bc)]:
  - @onerepo/core@0.4.0
  - @onerepo/package-manager@0.1.0
  - @onerepo/logger@0.1.1
  - @onerepo/graph@0.3.0
  - @onerepo/file@0.2.0
  - @onerepo/builders@0.1.1
  - @onerepo/git@0.1.1
  - @onerepo/subprocess@0.2.1
  - @onerepo/yargs@0.1.2

## 0.4.0

### Minor Changes

- Support optional `nameFormat` and `dirnameFormat` for generate config [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

### Patch Changes

- Support dotfiles when running generate [#153](https://github.com/paularmstrong/onerepo/pull/153) ([@wmintarja-figure](https://github.com/wmintarja-figure))

- Updated dependencies [[`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6), [`f00839c`](https://github.com/paularmstrong/onerepo/commit/f00839c574102c54101370f09e2ffe70fb61f8d6)]:
  - @onerepo/core@0.3.0

## 0.3.1

### Patch Changes

- Fixes issue with `install` not completing due to missing tab-completions. [#152](https://github.com/paularmstrong/onerepo/pull/152) ([@paularmstrong](https://github.com/paularmstrong))

- When the working directory is a workspace and the user prompts for `--help`, an error would be thrown looking for the `subcommandDir` if it did not exist. We now check for the existence of said directory before attempting to add commands to the yargs app, preventing throwing an error during help generation. [#149](https://github.com/paularmstrong/onerepo/pull/149) ([@paularmstrong](https://github.com/paularmstrong))

- Updates to `glob@9` during workspace and file globbing operations. [#145](https://github.com/paularmstrong/onerepo/pull/145) ([@paularmstrong](https://github.com/paularmstrong))

- Allow command `description` to be `false`. There are times when a command should remain undocumented and hidden from general use and this is how Yargs allows doing so. [#142](https://github.com/paularmstrong/onerepo/pull/142) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`e279809`](https://github.com/paularmstrong/onerepo/commit/e279809fcac4be0fe3d7622f3d2c7cca70d568d2), [`54abe47`](https://github.com/paularmstrong/onerepo/commit/54abe47ebe1eae9c6e70ea344b099b05b63621e2), [`cee04a6`](https://github.com/paularmstrong/onerepo/commit/cee04a62e60909bba1838314abcc909e2a531136), [`248af36`](https://github.com/paularmstrong/onerepo/commit/248af36e324824ec9587190e73ea7fe03bc955f3)]:
  - @onerepo/core@0.2.1
  - @onerepo/graph@0.2.1
  - @onerepo/yargs@0.1.1

## 0.3.0

### Minor Changes

- Fixes ESM output to es2022 and removes usage of `__dirname`. This should make things a bit more strict and usable in ESM contexts and ruin CJS contexts. [#143](https://github.com/paularmstrong/onerepo/pull/143) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Updated dependencies [[`5916683`](https://github.com/paularmstrong/onerepo/commit/59166834467f9bf3427c7bdca91776cc228e9002)]:
  - @onerepo/builders@0.1.0
  - @onerepo/core@0.2.0
  - @onerepo/file@0.1.0
  - @onerepo/git@0.1.0
  - @onerepo/graph@0.2.0
  - @onerepo/logger@0.1.0
  - @onerepo/subprocess@0.2.0
  - @onerepo/yargs@0.1.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`be92675`](https://github.com/paularmstrong/onerepo/commit/be926755919bd80a78126acfe2d38421eceeb16d)]:
  - @onerepo/subprocess@0.1.1
  - @onerepo/core@0.1.2
  - @onerepo/git@0.0.3

## 0.2.0

### Minor Changes

- When running a `batch()` process, if there are only 2-CPUs available, use both CPUs instead of `cpus.length - 1`. While we normally encourage using one less than available to avoid locking up the main processes, it should still be faster to spawn a separate process to the same CPU than to do all tasks synchronously. [#132](https://github.com/paularmstrong/onerepo/pull/132) ([@paularmstrong](https://github.com/paularmstrong))

### Patch Changes

- Ensure all dist files are included recursively in published packages. [#133](https://github.com/paularmstrong/onerepo/pull/133) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`8b9265f`](https://github.com/paularmstrong/onerepo/commit/8b9265fedc1cb6f9bd3d62e5d8af71e40ba4bb51), [`a57a69d`](https://github.com/paularmstrong/onerepo/commit/a57a69d7813bd2f965b0f00af366204637b6f81e)]:
  - @onerepo/subprocess@0.1.0
  - @onerepo/builders@0.0.2
  - @onerepo/core@0.1.1
  - @onerepo/file@0.0.2
  - @onerepo/git@0.0.2
  - @onerepo/graph@0.1.1
  - @onerepo/logger@0.0.2

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
