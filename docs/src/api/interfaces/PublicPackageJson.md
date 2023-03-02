---
title: 'API: interfaces/PublicPackageJson'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / PublicPackageJson

# Interface: PublicPackageJson

## Hierarchy

- [`PackageJson`](/docs/core/api/interfaces/PackageJson/)

  ↳ **`PublicPackageJson`**

## Properties

### alias

`Optional` **alias**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[alias](/docs/core/api/interfaces/PackageJson/#alias)

#### Defined in

[modules/graph/src/Workspace.ts:192](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L192)

---

### author

`Optional` **author**: `string` \| `Person`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[author](/docs/core/api/interfaces/PackageJson/#author)

#### Defined in

[modules/graph/src/Workspace.ts:176](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L176)

---

### bin

`Optional` **bin**: `string` \| `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[bin](/docs/core/api/interfaces/PackageJson/#bin)

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

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[bugs](/docs/core/api/interfaces/PackageJson/#bugs)

#### Defined in

[modules/graph/src/Workspace.ts:174](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L174)

---

### bundleDependencies

`Optional` **bundleDependencies**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[bundleDependencies](/docs/core/api/interfaces/PackageJson/#bundledependencies)

#### Defined in

[modules/graph/src/Workspace.ts:186](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L186)

---

### contributors

`Optional` **contributors**: (`string` \| `Person`)[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[contributors](/docs/core/api/interfaces/PackageJson/#contributors)

#### Defined in

[modules/graph/src/Workspace.ts:177](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L177)

---

### dependencies

`Optional` **dependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[dependencies](/docs/core/api/interfaces/PackageJson/#dependencies)

#### Defined in

[modules/graph/src/Workspace.ts:182](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L182)

---

### description

`Optional` **description**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[description](/docs/core/api/interfaces/PackageJson/#description)

#### Defined in

[modules/graph/src/Workspace.ts:170](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L170)

---

### devDependencies

`Optional` **devDependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[devDependencies](/docs/core/api/interfaces/PackageJson/#devdependencies)

#### Defined in

[modules/graph/src/Workspace.ts:183](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L183)

---

### engines

`Optional` **engines**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[engines](/docs/core/api/interfaces/PackageJson/#engines)

#### Defined in

[modules/graph/src/Workspace.ts:189](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L189)

---

### files

`Optional` **files**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[files](/docs/core/api/interfaces/PackageJson/#files)

#### Defined in

[modules/graph/src/Workspace.ts:178](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L178)

---

### homepage

`Optional` **homepage**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[homepage](/docs/core/api/interfaces/PackageJson/#homepage)

#### Defined in

[modules/graph/src/Workspace.ts:173](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L173)

---

### keywords

`Optional` **keywords**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[keywords](/docs/core/api/interfaces/PackageJson/#keywords)

#### Defined in

[modules/graph/src/Workspace.ts:172](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L172)

---

### license

**license**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[license](/docs/core/api/interfaces/PackageJson/#license)

#### Defined in

[modules/graph/src/Workspace.ts:175](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L175)

---

### main

`Optional` **main**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[main](/docs/core/api/interfaces/PackageJson/#main)

#### Defined in

[modules/graph/src/Workspace.ts:179](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L179)

---

### name

**name**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[name](/docs/core/api/interfaces/PackageJson/#name)

#### Defined in

[modules/graph/src/Workspace.ts:169](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L169)

---

### optionalDependencies

`Optional` **optionalDependencies**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[optionalDependencies](/docs/core/api/interfaces/PackageJson/#optionaldependencies)

#### Defined in

[modules/graph/src/Workspace.ts:187](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L187)

---

### os

`Optional` **os**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[os](/docs/core/api/interfaces/PackageJson/#os)

#### Defined in

[modules/graph/src/Workspace.ts:190](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L190)

---

### overrides

`Optional` **overrides**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[overrides](/docs/core/api/interfaces/PackageJson/#overrides)

#### Defined in

[modules/graph/src/Workspace.ts:188](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L188)

---

### peerDependencies

`Optional` **peerDependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[peerDependencies](/docs/core/api/interfaces/PackageJson/#peerdependencies)

#### Defined in

[modules/graph/src/Workspace.ts:184](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L184)

---

### peerDependenciesMeta

`Optional` **peerDependenciesMeta**: `Record`<`string`, { `optional`: `boolean` }\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[peerDependenciesMeta](/docs/core/api/interfaces/PackageJson/#peerdependenciesmeta)

#### Defined in

[modules/graph/src/Workspace.ts:185](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L185)

---

### private

`Optional` **private**: `false`

#### Defined in

[modules/graph/src/Workspace.ts:208](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L208)

---

### publishConfig

`Optional` **publishConfig**: `PublishConfig`

#### Defined in

[modules/graph/src/Workspace.ts:209](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L209)

---

### scripts

`Optional` **scripts**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[scripts](/docs/core/api/interfaces/PackageJson/#scripts)

#### Defined in

[modules/graph/src/Workspace.ts:181](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L181)

---

### version

`Optional` **version**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[version](/docs/core/api/interfaces/PackageJson/#version)

#### Defined in

[modules/graph/src/Workspace.ts:171](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L171)
