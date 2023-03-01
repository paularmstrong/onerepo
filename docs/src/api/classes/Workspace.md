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

## Constructors

### constructor

**new Workspace**(`rootLocation`, `location`, `packageJson`, `moduleRequire?`)

#### Parameters

| Name            | Type                                                    | Default value |
| :-------------- | :------------------------------------------------------ | :------------ |
| `rootLocation`  | `string`                                                | `undefined`   |
| `location`      | `string`                                                | `undefined`   |
| `packageJson`   | [`PackageJson`](/docs/core/api/interfaces/PackageJson/) | `undefined`   |
| `moduleRequire` | `NodeRequire`                                           | `require`     |

#### Defined in

[modules/graph/src/Workspace.ts:11](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L11)

## Accessors

### aliases

`get` **aliases**(): `string`[]

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

#### Returns

`string`[]

#### Defined in

[modules/graph/src/Workspace.ts:61](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L61)

---

### dependencies

`get` **dependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:70](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L70)

---

### description

`get` **description**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:22](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L22)

---

### devDependencies

`get` **devDependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:74](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L74)

---

### isRoot

`get` **isRoot**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:26](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L26)

---

### location

`get` **location**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:30](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L30)

---

### main

`get` **main**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:38](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L38)

---

### name

`get` **name**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:18](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L18)

---

### packageJson

`get` **packageJson**(): `Object`

#### Returns

`Object`

| Name                    | Type                                           |
| :---------------------- | :--------------------------------------------- |
| `alias?`                | `string`[]                                     |
| `author?`               | `string` \| `Person`                           |
| `bin?`                  | `string` \| `Record`<`string`, `string`\>      |
| `bugs?`                 | { `email?`: `string` ; `url?`: `string` }      |
| `bugs.email?`           | `string`                                       |
| `bugs.url?`             | `string`                                       |
| `bundleDependencies?`   | `string`[]                                     |
| `contributors?`         | (`string` \| `Person`)[]                       |
| `dependencies?`         | `Record`<`string`, `string`\>                  |
| `description?`          | `string`                                       |
| `devDependencies?`      | `Record`<`string`, `string`\>                  |
| `engines?`              | `Record`<`string`, `string`\>                  |
| `files?`                | `string`[]                                     |
| `homepage?`             | `string`                                       |
| `keywords?`             | `string`[]                                     |
| `license`               | `string`                                       |
| `main?`                 | `string`                                       |
| `name`                  | `string`                                       |
| `optionalDependencies?` | `string`[]                                     |
| `os?`                   | `string`[]                                     |
| `overrides?`            | `Record`<`string`, `string`\>                  |
| `peerDependencies?`     | `Record`<`string`, `string`\>                  |
| `peerDependenciesMeta?` | `Record`<`string`, { `optional`: `boolean` }\> |
| `scripts?`              | `Record`<`string`, `string`\>                  |
| `version?`              | `string`                                       |

#### Defined in

[modules/graph/src/Workspace.ts:42](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L42)

---

### peerDependencies

`get` **peerDependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:78](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L78)

---

### private

`get` **private**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:82](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L82)

---

### publishConfig

`get` **publishConfig**(): `PublishConfig`

#### Returns

`PublishConfig`

#### Defined in

[modules/graph/src/Workspace.ts:46](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L46)

---

### scope

`get` **scope**(): `string`

Get module name scope, eg `@onerepo`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:53](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L53)

---

### tasks

`get` **tasks**(): `Partial`<`Record`<[`Lifecycle`](/docs/core/api/public/#lifecycle), [`Tasks`](/docs/core/api/public/#tasks)\>\>

#### Returns

`Partial`<`Record`<[`Lifecycle`](/docs/core/api/public/#lifecycle), [`Tasks`](/docs/core/api/public/#tasks)\>\>

#### Defined in

[modules/graph/src/Workspace.ts:86](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L86)

---

### version

`get` **version**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:34](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L34)

## Methods

### getTasks

**getTasks**(`lifecycle`): `Required`<[`Tasks`](/docs/core/api/public/#tasks)\>

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

#### Returns

`Required`<[`Tasks`](/docs/core/api/public/#tasks)\>

#### Defined in

[modules/graph/src/Workspace.ts:99](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L99)

---

### relative

**relative**(`to`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `to` | `string` |

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:112](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L112)

---

### resolve

**resolve**(`...pathSegments`): `string`

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `...pathSegments` | `string`[] |

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:108](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L108)
