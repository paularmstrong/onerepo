---
title: 'API: classes/Repository'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Repository

# Class: Repository

## Constructors

### constructor

**new Repository**(`location`, `packageJson`, `moduleRequire?`)

#### Parameters

| Name            | Type                                                                  | Default value |
| :-------------- | :-------------------------------------------------------------------- | :------------ |
| `location`      | `string`                                                              | `undefined`   |
| `packageJson`   | [`PrivatePackageJson`](/docs/core/api/interfaces/PrivatePackageJson/) | `undefined`   |
| `moduleRequire` | `NodeRequire`                                                         | `require`     |

#### Defined in

[modules/graph/src/Graph.ts:27](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L27)

## Accessors

### root

`get` **root**(): [`Workspace`](/docs/core/api/classes/Workspace/)

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:63](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L63)

---

### serialized

`get` **serialized**(): `Serialized`

Get a serialized representation of the graph

#### Returns

`Serialized`

#### Defined in

[modules/graph/src/Graph.ts:51](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L51)

---

### workspaceLocations

`get` **workspaceLocations**(): `string`[]

#### Returns

`string`[]

#### Defined in

[modules/graph/src/Graph.ts:59](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L59)

---

### workspaces

`get` **workspaces**(): [`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:55](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L55)

## Methods

### affected

**affected**<`T`\>(`source`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Type parameters

| Name | Type                                                                 |
| :--- | :------------------------------------------------------------------- |
| `T`  | extends `string` \| [`Workspace`](/docs/core/api/classes/Workspace/) |

#### Parameters

| Name     | Type         |
| :------- | :----------- |
| `source` | `T` \| `T`[] |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:93](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L93)

---

### dependencies

**dependencies**<`T`\>(`sources?`, `includeSelf?`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Type parameters

| Name | Type                                                                 |
| :--- | :------------------------------------------------------------------- |
| `T`  | extends `string` \| [`Workspace`](/docs/core/api/classes/Workspace/) |

#### Parameters

| Name          | Type         | Default value |
| :------------ | :----------- | :------------ |
| `sources?`    | `T` \| `T`[] | `undefined`   |
| `includeSelf` | `boolean`    | `false`       |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:82](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L82)

---

### dependents

**dependents**<`T`\>(`sources?`, `includeSelf?`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get a list of workspaces that depend on the given input sources.

#### Type parameters

| Name | Type                                                                 |
| :--- | :------------------------------------------------------------------- |
| `T`  | extends `string` \| [`Workspace`](/docs/core/api/classes/Workspace/) |

#### Parameters

| Name          | Type         | Default value | Description           |
| :------------ | :----------- | :------------ | :-------------------- |
| `sources?`    | `T` \| `T`[] | `undefined`   | one or more workspaes |
| `includeSelf` | `boolean`    | `false`       |                       |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:72](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L72)

---

### getAllByLocation

**getAllByLocation**(`locations`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `locations` | `string`[] |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:131](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L131)

---

### getAllByName

**getAllByName**(`names`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Parameters

| Name    | Type       |
| :------ | :--------- |
| `names` | `string`[] |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:110](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L110)

---

### getByLocation

**getByLocation**(`location`): `null` \| [`Workspace`](/docs/core/api/classes/Workspace/)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `location` | `string` |

#### Returns

`null` \| [`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:114](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L114)

---

### getByName

**getByName**(`name`): `null` \| [`Workspace`](/docs/core/api/classes/Workspace/)

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`null` \| [`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:97](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L97)

---

### isolatedGraph

**isolatedGraph**(`sources`): `Object`

Get an isolated graph of dependents from the list of sources

#### Parameters

| Name      | Type                                               |
| :-------- | :------------------------------------------------- |
| `sources` | [`Workspace`](/docs/core/api/classes/Workspace/)[] |

#### Returns

`Object`

| Name                    | Type                                                                                                     |
| :---------------------- | :------------------------------------------------------------------------------------------------------- |
| `addEdge`               | (`u`: `string`, `v`: `string`, `weight?`: `number`) => `any`                                             |
| `addNode`               | (`node`: `string`) => `any`                                                                              |
| `adjacent`              | (`node`: `string`) => `string`[]                                                                         |
| `depthFirstSearch`      | (`sourceNodes?`: `string`[], `includeSourceNodes?`: `boolean`, `errorOnCycle?`: `boolean`) => `string`[] |
| `deserialize`           | (`serialized`: `Serialized`) => `any`                                                                    |
| `getEdgeWeight`         | (`u`: `string`, `v`: `string`) => `number`                                                               |
| `hasCycle`              | () => `boolean`                                                                                          |
| `hasEdge`               | (`u`: `string`, `v`: `string`) => `boolean`                                                              |
| `indegree`              | (`node`: `string`) => `number`                                                                           |
| `lowestCommonAncestors` | (`node1`: `string`, `node2`: `string`) => `string`[]                                                     |
| `nodes`                 | () => `string`[]                                                                                         |
| `outdegree`             | (`node`: `string`) => `number`                                                                           |
| `removeEdge`            | (`u`: `string`, `v`: `string`) => `any`                                                                  |
| `removeNode`            | (`node`: `string`) => `any`                                                                              |
| `serialize`             | () => `Serialized`                                                                                       |
| `setEdgeWeight`         | (`u`: `string`, `v`: `string`, `weight`: `number`) => `any`                                              |
| `shortestPath`          | (`source`: `string`, `destination`: `string`) => `string`[] & { `weight?`: `number` }                    |
| `topologicalSort`       | (`sourceNodes?`: `string`[], `includeSourceNodes?`: `boolean`) => `string`[]                             |

#### Defined in

[modules/graph/src/Graph.ts:145](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L145)
