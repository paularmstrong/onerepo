---
title: 'API: interfaces/PackageJson'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / PackageJson

# Interface: PackageJson

## Hierarchy

- **`PackageJson`**

  ↳ [`PrivatePackageJson`](/docs/core/api/interfaces/PrivatePackageJson/)

  ↳ [`PublicPackageJson`](/docs/core/api/interfaces/PublicPackageJson/)

  ↳ [`PackageJsonWithLocation`](/docs/core/api/interfaces/PackageJsonWithLocation/)

## Properties

### alias

`Optional` **alias**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:147](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L147)

---

### author

`Optional` **author**: `string` \| `Person`

#### Defined in

[modules/graph/src/Workspace.ts:131](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L131)

---

### bin

`Optional` **bin**: `string` \| `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:135](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L135)

---

### bugs

`Optional` **bugs**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `email?` | `string` |
| `url?`   | `string` |

#### Defined in

[modules/graph/src/Workspace.ts:129](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L129)

---

### bundleDependencies

`Optional` **bundleDependencies**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:141](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L141)

---

### contributors

`Optional` **contributors**: (`string` \| `Person`)[]

#### Defined in

[modules/graph/src/Workspace.ts:132](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L132)

---

### dependencies

`Optional` **dependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:137](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L137)

---

### description

`Optional` **description**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:125](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L125)

---

### devDependencies

`Optional` **devDependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:138](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L138)

---

### engines

`Optional` **engines**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:144](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L144)

---

### files

`Optional` **files**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:133](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L133)

---

### homepage

`Optional` **homepage**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:128](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L128)

---

### keywords

`Optional` **keywords**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:127](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L127)

---

### license

**license**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:130](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L130)

---

### main

`Optional` **main**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:134](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L134)

---

### name

**name**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:124](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L124)

---

### optionalDependencies

`Optional` **optionalDependencies**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:142](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L142)

---

### os

`Optional` **os**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:145](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L145)

---

### overrides

`Optional` **overrides**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:143](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L143)

---

### peerDependencies

`Optional` **peerDependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:139](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L139)

---

### peerDependenciesMeta

`Optional` **peerDependenciesMeta**: `Record`<`string`, { `optional`: `boolean` }\>

#### Defined in

[modules/graph/src/Workspace.ts:140](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L140)

---

### scripts

`Optional` **scripts**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:136](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L136)

---

### version

`Optional` **version**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:126](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L126)
