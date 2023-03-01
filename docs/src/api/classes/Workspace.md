---
title: 'API: classes/Workspace'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/index/) / Workspace

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

[modules/graph/src/Workspace.ts:10](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L10)

## Accessors

### aliases

`get` **aliases**(): `string`[]

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

#### Returns

`string`[]

#### Defined in

[modules/graph/src/Workspace.ts:60](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L60)

---

### dependencies

`get` **dependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:69](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L69)

---

### description

`get` **description**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:21](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L21)

---

### devDependencies

`get` **devDependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:73](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L73)

---

### isRoot

`get` **isRoot**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:25](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L25)

---

### location

`get` **location**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:29](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L29)

---

### main

`get` **main**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:37](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L37)

---

### name

`get` **name**(): `string`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:17](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L17)

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

[modules/graph/src/Workspace.ts:41](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L41)

---

### peerDependencies

`get` **peerDependencies**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Defined in

[modules/graph/src/Workspace.ts:77](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L77)

---

### private

`get` **private**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/graph/src/Workspace.ts:81](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L81)

---

### publishConfig

`get` **publishConfig**(): `PublishConfig`

#### Returns

`PublishConfig`

#### Defined in

[modules/graph/src/Workspace.ts:45](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L45)

---

### scope

`get` **scope**(): `string`

Get module name scope, eg `@onerepo`

#### Returns

`string`

#### Defined in

[modules/graph/src/Workspace.ts:52](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L52)

---

### tasks

`get` **tasks**(): `Partial`<`Record`<[`Lifecycle`](/docs/core/api/index/#lifecycle), [`Tasks`](/docs/core/api/index/#tasks)\>\>

#### Returns

`Partial`<`Record`<[`Lifecycle`](/docs/core/api/index/#lifecycle), [`Tasks`](/docs/core/api/index/#tasks)\>\>

#### Defined in

[modules/graph/src/Workspace.ts:85](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L85)

---

### version

`get` **version**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[modules/graph/src/Workspace.ts:33](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L33)

## Methods

### getTasks

**getTasks**(`lifecycle`): `Required`<[`Tasks`](/docs/core/api/index/#tasks)\>

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

#### Returns

`Required`<[`Tasks`](/docs/core/api/index/#tasks)\>

#### Defined in

[modules/graph/src/Workspace.ts:98](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L98)

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

[modules/graph/src/Workspace.ts:111](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L111)

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

[modules/graph/src/Workspace.ts:107](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/graph/src/Workspace.ts#L107)
