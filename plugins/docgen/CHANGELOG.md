# @onerepo/plugin-docgen

## 1.0.0-beta.2

### Dependencies updated

- onerepo@1.0.0-beta.2
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

- When running [`docgen`](https://onerepo.tools/plugins/docgen/), only default configuration options will be used. ([5e1d3c3](https://github.com/paularmstrong/onerepo/commit/5e1d3c34a2e0a08ee38a5e81d6d392178af3631c))

### Patch changes

- Updated oneRepo dependencies to pin as a peer to the appropriate oneRepo release instead of internal sub-packages. ([92e1441](https://github.com/paularmstrong/onerepo/commit/92e14416aebaf47d21fe7cbcba625f6d48a9b001))

### Dependencies updated

- onerepo@1.0.0-beta.1
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

### Dependencies updated

- onerepo@1.0.0-beta.0
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

## 0.1.0

### Minor changes

- `--show-advanced` will no longer appear in option lists outside of the global command. Other globals will also be removed from sub-commands. ([acde181](https://github.com/paularmstrong/onerepo/commit/acde181931ed4571df2e1b8ebf39b9f265bf4ab8))
- Changed format for command aliases to show the full command (with all parent commands) instead of just the individual alias names. This means `'$0'` aliases will now show as the correct incantation for the command. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Will no longer render the "Required" column if no arguments are required. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))
- Adds advanced/hidden option `--use-defaults` to use the default root configuration when generating documentation. ([db178cc](https://github.com/paularmstrong/onerepo/commit/db178cc3b0ca8a2bbcaa4dee27e6c7e113bca875))

### Patch changes

- Correct CLI usage syntax in `--help` output. ([569a10e](https://github.com/paularmstrong/onerepo/commit/569a10e5678f280224bdc03fbc38b37fdaa096a5))

### Dependencies updated

- onerepo@0.17.0
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

## 0.0.1

### Patch Changes

- Fix package.json homepage URLs. [#561](https://github.com/paularmstrong/onerepo/pull/561) ([@paularmstrong](https://github.com/paularmstrong))

- Updated unified string to markdown generation dependencies. [#547](https://github.com/paularmstrong/onerepo/pull/547) ([@paularmstrong](https://github.com/paularmstrong))

- Updated dependencies [[`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`af3f289`](https://github.com/paularmstrong/onerepo/commit/af3f289eb94a5e3668b4df99bb2cf43abee15b16), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`2381d71`](https://github.com/paularmstrong/onerepo/commit/2381d71623a3b567fafb644f143a07e79b294110), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`3e9e2fa`](https://github.com/paularmstrong/onerepo/commit/3e9e2fa393916134d2ded6320bac34fb787a7ccf), [`19049eb`](https://github.com/paularmstrong/onerepo/commit/19049ebd60f965c4ab8bdc16045ce2112ae35fc1), [`48fbd3d`](https://github.com/paularmstrong/onerepo/commit/48fbd3d8564b936e1435140eefb8e9754ea60727), [`9fbcb66`](https://github.com/paularmstrong/onerepo/commit/9fbcb666152051a84d46bee074cf489a0a11cc4d), [`c6a3d76`](https://github.com/paularmstrong/onerepo/commit/c6a3d7621f507e87adaa69281e00c992347cb0ba), [`0de22b4`](https://github.com/paularmstrong/onerepo/commit/0de22b4cd25911794975cedb709e5c378c3982ae), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`1bbef18`](https://github.com/paularmstrong/onerepo/commit/1bbef18a5f5c768921916db2d641b9cf60815e31), [`c87a848`](https://github.com/paularmstrong/onerepo/commit/c87a848319c91abf4d2fdd4b2eb2f8684d99c852), [`6233a36`](https://github.com/paularmstrong/onerepo/commit/6233a3671d22ab312a8e04b935f13980ac30d947), [`65bc5f0`](https://github.com/paularmstrong/onerepo/commit/65bc5f0267abb728ea603f43a7e68e4e1996709c), [`154a2d1`](https://github.com/paularmstrong/onerepo/commit/154a2d151012f0c0c31831ab3ecab32ef6dc45ef), [`bc23910`](https://github.com/paularmstrong/onerepo/commit/bc239102ca115db4cb92f64097c26bbda57fd0de), [`9dea7b0`](https://github.com/paularmstrong/onerepo/commit/9dea7b02ba2c8257714ae1b9d4235a0f7e5a0b75), [`4c67f8b`](https://github.com/paularmstrong/onerepo/commit/4c67f8ba789f8bc79ea6962b1cd08c8c8f7305f4)]:
  - onerepo@0.16.0
  - @onerepo/file@0.6.0
  - @onerepo/git@0.5.0
  - @onerepo/yargs@0.6.0
