# @onerepo/git

## 1.1.0

### Minor changes

- Use a new option in `git.getModifiedFiles` to return all files mapped by status instead of only added & modified files as an array: `git.getModifiedFiles({ byStatus: true })`. ([a2942ed](https://github.com/paularmstrong/onerepo/commit/a2942ede514a65f5d09ff4595ca8bb616a83c5e5))

### Patch changes

- Updated internal/third-party typescript definitions ([e5fb5fa](https://github.com/paularmstrong/onerepo/commit/e5fb5fa0e9fbe6ff18c2d993cb22119a3908df73))
- Internal formatting changes due to Prettier upgrade. ([f8cb805](https://github.com/paularmstrong/onerepo/commit/f8cb80550ceabdce6ff6c13bf22466a59e694b0f))

### Dependencies updated

- @onerepo/graph@1.0.4
- @onerepo/package-manager@1.0.4
- @onerepo/subprocess@1.0.4
- @onerepo/file@1.0.4
- @onerepo/logger@1.0.4

> View the full changelog: [a117f2a...9895235](https://github.com/paularmstrong/onerepo/compare/a117f2a8326b148de98fcffefc37e6ad46edcb87...98952352d3c32adf853657e46e14f12fe1737992)

## 1.0.3

### Dependencies updated

- @onerepo/graph@1.0.3
- @onerepo/package-manager@1.0.3
- @onerepo/subprocess@1.0.3
- @onerepo/file@1.0.3
- @onerepo/logger@1.0.3

> View the full changelog: [c8234dc...9359c78](https://github.com/paularmstrong/onerepo/compare/c8234dc79f7b7f40ca42167d41a6a6f4126c5286...9359c78e4da54e0402ad6a4bf5890a8a71972c8e)

## 1.0.2

### Patch changes

- Fixed typo/grammar mistake in git workflow docs. ([f772097](https://github.com/paularmstrong/onerepo/commit/f77209731674a8fd0286bd0a8c0cf2eced952ba1))

### Dependencies updated

- @onerepo/graph@1.0.2
- @onerepo/package-manager@1.0.2
- @onerepo/subprocess@1.0.2
- @onerepo/file@1.0.2
- @onerepo/logger@1.0.2

> View the full changelog: [74892d8...d7f3a29](https://github.com/paularmstrong/onerepo/compare/74892d8605917bb0d8a1c3fe113d1b04f2505abb...d7f3a2956c6d8ea4a4346ac2541b67196fdc6011)

## 1.0.1

### Dependencies updated

- @onerepo/graph@1.0.1
- @onerepo/package-manager@1.0.1
- @onerepo/subprocess@1.0.1
- @onerepo/file@1.0.1
- @onerepo/logger@1.0.1

> View the full changelog: [cd94664...6ae1391](https://github.com/paularmstrong/onerepo/compare/cd9466419b207f690e55f87d0e4632eebdc0ca6a...6ae13912ef4b9bedab788be13fa167a709b26bba)

## 1.0.0

🎉 Initial stable release!

_For historical changelogs, please view the [oneRepo source](https://github.com/paularmstrong/onerepo/tree/main/modules/git)._
