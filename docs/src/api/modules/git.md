---
title: 'API: modules/git'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / git

# Namespace: git

## Functions

### getBranch

**getBranch**(`«destructured»?`): `Promise`<`string`\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Options` |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/git/src/index.ts:9](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L9)

---

### getCurrentSha

**getCurrentSha**(`«destructured»?`): `Promise`<`string`\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Options` |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/git/src/index.ts:161](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L161)

---

### getMergeBase

**getMergeBase**(`«destructured»?`): `Promise`<`string`\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Options` |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/git/src/index.ts:22](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L22)

---

### getModifiedFiles

**getModifiedFiles**(`from?`, `through?`, `«destructured»?`): `Promise`<`Record`<`string`, `string`[]\>\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `from?`          | `string`  |
| `through?`       | `string`  |
| `«destructured»` | `Options` |

#### Returns

`Promise`<`Record`<`string`, `string`[]\>\>

#### Defined in

[modules/git/src/index.ts:90](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L90)

---

### getStatus

**getStatus**(`«destructured»?`): `Promise`<`string`\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Options` |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/git/src/index.ts:76](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L76)

---

### updateIndex

**updateIndex**(`paths`, `«destructured»?`): `Promise`<`string`\>

#### Parameters

| Name             | Type                   |
| :--------------- | :--------------------- |
| `paths`          | `string` \| `string`[] |
| `«destructured»` | `Options`              |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/git/src/index.ts:174](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L174)
