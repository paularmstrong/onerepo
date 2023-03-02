---
title: 'API: classes/Workspace'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Workspace

# Class: Workspace

## Accessors

### aliases

`get` **aliases**(): `string`[]

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

#### Returns

`string`[]

#### Defined in

[modules/graph/src/Workspace.ts:68](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L68)

---

### dependencies

`get` **dependencies**(): `Record`<`string`, `string`\>

Get the `package.json` defined production dependencies for the workspace.

#### Returns

`Record`<`string`, `string`\>

Map of modules to their version.

#### Defined in

[modules/graph/src/Workspace.ts:82](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L82)

---

### description

`get` **description**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:29](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L29)

---

### devDependencies

`get` **devDependencies**(): `Record`<`string`, `string`\>

Get the `package.json` defined development dependencies for the workspace.

#### Returns

`Record`<`string`, `string`\>

Map of modules to their version.

#### Defined in

[modules/graph/src/Workspace.ts:91](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L91)

---

### isRoot

`get` **isRoot**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:33](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L33)

---

### location

`get` **location**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:37](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L37)

---

### main

`get` **main**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:45](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L45)

---

### name

`get` **name**(): `string`

The full `name` of the Workspace, as defined in its `package.json`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:24](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L24)

---

### packageJson

`get` **packageJson**(): [`PackageJson`](/docs/core/api/interfaces/PackageJson/)

#### Returns

[`PackageJson`](/docs/core/api/interfaces/PackageJson/)

#### Defined in

[modules/graph/src/Workspace.ts:49](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L49)

---

### peerDependencies

`get` **peerDependencies**(): `Record`<`string`, `string`\>

Get the `package.json` defined peer dependencies for the workspace.

#### Returns

`Record`<`string`, `string`\>

Map of modules to their version.

#### Defined in

[modules/graph/src/Workspace.ts:100](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L100)

---

### private

`get` **private**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:104](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L104)

---

### publishConfig

`get` **publishConfig**(): `PublishConfig`

#### Returns

`PublishConfig`

#### Defined in

[modules/graph/src/Workspace.ts:53](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L53)

---

### scope

`get` **scope**(): `string`

Get module name scope if there is one, eg `@onerepo`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:60](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L60)

---

### tasks

`get` **tasks**(): `Partial`<`Record`<[`Lifecycle`](/docs/core/api/public/#lifecycle), [`Tasks`](/docs/core/api/public/#tasks)\>\>

#### Returns

`Partial`<`Record`<[`Lifecycle`](/docs/core/api/public/#lifecycle), [`Tasks`](/docs/core/api/public/#tasks)\>\>

#### Defined in

[modules/graph/src/Workspace.ts:108](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L108)

---

### version

`get` **version**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:41](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L41)

## Methods

### getTasks

**getTasks**(`lifecycle`): `Required`<[`Tasks`](/docs/core/api/public/#tasks)\>

Get a list of Workspace tasks for the given lifecycle

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

#### Returns

`Required`<[`Tasks`](/docs/core/api/public/#tasks)\>

#### Defined in

[modules/graph/src/Workspace.ts:124](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L124)

---

### relative

**relative**(`to`): `string`

Get the relative path of an absolute path to the workspace’s location root

```ts
const relativePath = workspace.relative('/some/absolute/path');
```

#### Parameters

| Name | Type     | Description       |
| :--- | :------- | :---------------- |
| `to` | `string` | Absolute filepath |

#### Returns

`string`

Relative path to the workspace’s root location.

#### Defined in

[modules/graph/src/Workspace.ts:157](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L157)

---

### resolve

**resolve**(`...pathSegments`): `string`

Resolve a full filepath within the workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).

```ts
const main = workspace.resolve(workspace.main);
```

#### Parameters

| Name              | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| `...pathSegments` | `string`[] | A sequence of paths or path segments |

#### Returns

`string`

Absolute path based on the input path segments

#### Defined in

[modules/graph/src/Workspace.ts:143](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L143)
