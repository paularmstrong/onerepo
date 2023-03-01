---
title: 'API: interfaces/PrivatePackageJson'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/index/) / PrivatePackageJson

# Interface: PrivatePackageJson

## Hierarchy

- [`PackageJson`](/docs/core/api/interfaces/PackageJson/)

  ↳ **`PrivatePackageJson`**

## Properties

### alias

`Optional` **alias**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[alias](/docs/core/api/interfaces/PackageJson/#alias)

#### Defined in

[modules/graph/src/Workspace.ts:146](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L146)

---

### author

`Optional` **author**: `string` \| `Person`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[author](/docs/core/api/interfaces/PackageJson/#author)

#### Defined in

[modules/graph/src/Workspace.ts:130](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L130)

---

### bin

`Optional` **bin**: `string` \| `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[bin](/docs/core/api/interfaces/PackageJson/#bin)

#### Defined in

[modules/graph/src/Workspace.ts:134](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L134)

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

[modules/graph/src/Workspace.ts:128](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L128)

---

### bundleDependencies

`Optional` **bundleDependencies**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[bundleDependencies](/docs/core/api/interfaces/PackageJson/#bundledependencies)

#### Defined in

[modules/graph/src/Workspace.ts:140](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L140)

---

### contributors

`Optional` **contributors**: (`string` \| `Person`)[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[contributors](/docs/core/api/interfaces/PackageJson/#contributors)

#### Defined in

[modules/graph/src/Workspace.ts:131](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L131)

---

### dependencies

`Optional` **dependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[dependencies](/docs/core/api/interfaces/PackageJson/#dependencies)

#### Defined in

[modules/graph/src/Workspace.ts:136](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L136)

---

### description

`Optional` **description**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[description](/docs/core/api/interfaces/PackageJson/#description)

#### Defined in

[modules/graph/src/Workspace.ts:124](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L124)

---

### devDependencies

`Optional` **devDependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[devDependencies](/docs/core/api/interfaces/PackageJson/#devdependencies)

#### Defined in

[modules/graph/src/Workspace.ts:137](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L137)

---

### engines

`Optional` **engines**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[engines](/docs/core/api/interfaces/PackageJson/#engines)

#### Defined in

[modules/graph/src/Workspace.ts:143](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L143)

---

### files

`Optional` **files**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[files](/docs/core/api/interfaces/PackageJson/#files)

#### Defined in

[modules/graph/src/Workspace.ts:132](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L132)

---

### homepage

`Optional` **homepage**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[homepage](/docs/core/api/interfaces/PackageJson/#homepage)

#### Defined in

[modules/graph/src/Workspace.ts:127](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L127)

---

### keywords

`Optional` **keywords**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[keywords](/docs/core/api/interfaces/PackageJson/#keywords)

#### Defined in

[modules/graph/src/Workspace.ts:126](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L126)

---

### license

**license**: `"UNLICENSED"`

#### Overrides

[PackageJson](/docs/core/api/interfaces/PackageJson/).[license](/docs/core/api/interfaces/PackageJson/#license)

#### Defined in

[modules/graph/src/Workspace.ts:151](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L151)

---

### main

`Optional` **main**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[main](/docs/core/api/interfaces/PackageJson/#main)

#### Defined in

[modules/graph/src/Workspace.ts:133](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L133)

---

### name

**name**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[name](/docs/core/api/interfaces/PackageJson/#name)

#### Defined in

[modules/graph/src/Workspace.ts:123](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L123)

---

### optionalDependencies

`Optional` **optionalDependencies**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[optionalDependencies](/docs/core/api/interfaces/PackageJson/#optionaldependencies)

#### Defined in

[modules/graph/src/Workspace.ts:141](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L141)

---

### os

`Optional` **os**: `string`[]

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[os](/docs/core/api/interfaces/PackageJson/#os)

#### Defined in

[modules/graph/src/Workspace.ts:144](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L144)

---

### overrides

`Optional` **overrides**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[overrides](/docs/core/api/interfaces/PackageJson/#overrides)

#### Defined in

[modules/graph/src/Workspace.ts:142](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L142)

---

### peerDependencies

`Optional` **peerDependencies**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[peerDependencies](/docs/core/api/interfaces/PackageJson/#peerdependencies)

#### Defined in

[modules/graph/src/Workspace.ts:138](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L138)

---

### peerDependenciesMeta

`Optional` **peerDependenciesMeta**: `Record`<`string`, { `optional`: `boolean` }\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[peerDependenciesMeta](/docs/core/api/interfaces/PackageJson/#peerdependenciesmeta)

#### Defined in

[modules/graph/src/Workspace.ts:139](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L139)

---

### private

**private**: `true`

#### Defined in

[modules/graph/src/Workspace.ts:150](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L150)

---

### scripts

`Optional` **scripts**: `Record`<`string`, `string`\>

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[scripts](/docs/core/api/interfaces/PackageJson/#scripts)

#### Defined in

[modules/graph/src/Workspace.ts:135](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L135)

---

### version

`Optional` **version**: `string`

#### Inherited from

[PackageJson](/docs/core/api/interfaces/PackageJson/).[version](/docs/core/api/interfaces/PackageJson/#version)

#### Defined in

[modules/graph/src/Workspace.ts:125](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L125)

---

### workspaces

`Optional` **workspaces**: `string`[]

#### Defined in

[modules/graph/src/Workspace.ts:152](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L152)
