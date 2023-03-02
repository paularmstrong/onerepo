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

[modules/graph/src/Workspace.ts:192](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L192)

---

### author

`Optional` **author**: `string` \| `Person`

#### Defined in

[modules/graph/src/Workspace.ts:176](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L176)

---

### bin

`Optional` **bin**: `string` \| `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:180](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L180)

---

### bugs

`Optional` **bugs**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `email?` | `string` |
| `url?`   | `string` |

#### Defined in

[modules/graph/src/Workspace.ts:174](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L174)

---

### bundleDependencies

`Optional` **bundleDependencies**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:186](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L186)

---

### contributors

`Optional` **contributors**: (`string` \| `Person`)[]

#### Defined in

[modules/graph/src/Workspace.ts:177](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L177)

---

### dependencies

`Optional` **dependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:182](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L182)

---

### description

`Optional` **description**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:170](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L170)

---

### devDependencies

`Optional` **devDependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:183](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L183)

---

### engines

`Optional` **engines**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:189](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L189)

---

### files

`Optional` **files**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:178](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L178)

---

### homepage

`Optional` **homepage**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:173](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L173)

---

### keywords

`Optional` **keywords**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:172](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L172)

---

### license

**license**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:175](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L175)

---

### main

`Optional` **main**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:179](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L179)

---

### name

**name**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:169](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L169)

---

### optionalDependencies

`Optional` **optionalDependencies**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:187](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L187)

---

### os

`Optional` **os**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:190](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L190)

---

### overrides

`Optional` **overrides**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:188](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L188)

---

### peerDependencies

`Optional` **peerDependencies**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:184](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L184)

---

### peerDependenciesMeta

`Optional` **peerDependenciesMeta**: `Record`<`string`, { `optional`: `boolean` }\>

#### Defined in

[modules/graph/src/Workspace.ts:185](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L185)

---

### scripts

`Optional` **scripts**: `Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:181](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L181)

---

### version

`Optional` **version**: `string`

#### Defined in

[modules/graph/src/Workspace.ts:171](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L171)
