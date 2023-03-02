---
title: 'API: classes/Graph'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Graph

# Class: Graph

The oneRepo Graph is a representation of the entire repository’s workspaces and how they depend upon each other. Most commonly, you will want to use the graph to get lists of workspaces that either depend on some input or are dependencies thereof:

```ts
const workspacesToCheck = graph.affected('tacos');
for (const ws of workspacesToCheck) {
	// verify no issues based on changes
}
```

The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.

## Accessors

### root

`get` **root**(): [`Workspace`](/docs/core/api/classes/Workspace/)

Get the workspace that is at the root of the repository.

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:83](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L83)

---

### serialized

`get` **serialized**(): [`Serialized`](/docs/core/api/interfaces/Serialized/)

Get a serialized representation of the graph

#### Returns

[`Serialized`](/docs/core/api/interfaces/Serialized/)

#### Defined in

[modules/graph/src/Graph.ts:69](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L69)

---

### workspaces

`get` **workspaces**(): [`Workspace`](/docs/core/api/classes/Workspace/)[]

All workspaces that are part of the repository graph.

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:76](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L76)

## Methods

### affected

**affected**<`T`\>(`source`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get a list of workspaces that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`.

```ts
const dependents = graph.dependents(sources, true);
const affected = graph.affected(sources);

assert.isEqual(dependents, affecteed);
```

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

[modules/graph/src/Graph.ts:139](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L139)

---

### dependencies

**dependencies**<`T`\>(`sources?`, `includeSelf?`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get a list of workspaces that are dependencies of the given input sources.

```ts
const tacoDependencies = graph.dependencies('tacos');
```

#### Type parameters

| Name | Type                                                                 |
| :--- | :------------------------------------------------------------------- |
| `T`  | extends `string` \| [`Workspace`](/docs/core/api/classes/Workspace/) |

#### Parameters

| Name          | Type         | Default value | Description                                                                      |
| :------------ | :----------- | :------------ | :------------------------------------------------------------------------------- |
| `sources?`    | `T` \| `T`[] | `undefined`   | One or more workspaces by name or `Workspace` instance                           |
| `includeSelf` | `boolean`    | `false`       | Whether to include the `Workspaces` for the input `sources` in the return array. |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:116](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L116)

---

### dependents

**dependents**<`T`\>(`sources?`, `includeSelf?`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get a list of workspaces that depend on the given input sources.

```ts
const tacoDependents = graph.dependents('tacos');
```

#### Type parameters

| Name | Type                                                                 |
| :--- | :------------------------------------------------------------------- |
| `T`  | extends `string` \| [`Workspace`](/docs/core/api/classes/Workspace/) |

#### Parameters

| Name          | Type         | Default value | Description                                                                      |
| :------------ | :----------- | :------------ | :------------------------------------------------------------------------------- |
| `sources?`    | `T` \| `T`[] | `undefined`   | One or more workspaces by name or `Workspace` instance                           |
| `includeSelf` | `boolean`    | `false`       | Whether to include the `Workspaces` for the input `sources` in the return array. |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:97](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L97)

---

### getAllByLocation

**getAllByLocation**(`locations`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get all workspaces given an array of filepaths.

```ts
const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
```

#### Parameters

| Name        | Type       | Description                                                   |
| :---------- | :--------- | :------------------------------------------------------------ |
| `locations` | `string`[] | A list of filepath strings. May be file URLs or string paths. |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:218](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L218)

---

### getAllByName

**getAllByName**(`names`): [`Workspace`](/docs/core/api/classes/Workspace/)[]

Get a list of workspaces by name or alias

```ts
const workspaces = graph.getAllByName(['tacos', 'burritos']);
```

#### Parameters

| Name    | Type       | Description                                                                                                                                |
| :------ | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `names` | `string`[] | A list of workspace [names](/docs/core/api/classes/Workspace/#name) or any available [aliases](/docs/core/api/classes/Workspace/#aliases). |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)[]

#### Defined in

[modules/graph/src/Graph.ts:174](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L174)

---

### getByLocation

**getByLocation**(`location`): [`Workspace`](/docs/core/api/classes/Workspace/)

Get the equivalent Workspace for a filepath. This can be any location within a Workspace, not just its root.

```ts
// in Node.js
graph.getByLocation(__dirname);

// in pure ESM
graph.getByLocation(import.meta.url);
```

#### Parameters

| Name       | Type     | Description                                          |
| :--------- | :------- | :--------------------------------------------------- |
| `location` | `string` | A filepath string. May be a file URL or string path. |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:192](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L192)

---

### getByName

**getByName**(`name`): [`Workspace`](/docs/core/api/classes/Workspace/)

Get a workspace by string name. This can be either the full package name or one of its `aliases`

```ts
const workspace = graph.getByName('my-cool-package');
```

#### Parameters

| Name   | Type     | Description                                                                                                                         |
| :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `name` | `string` | A Workspace’s [name](/docs/core/api/classes/Workspace/#name) or any available [aliases](/docs/core/api/classes/Workspace/#aliases). |

#### Returns

[`Workspace`](/docs/core/api/classes/Workspace/)

#### Defined in

[modules/graph/src/Graph.ts:152](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L152)

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

This does not return a oneRepo `Graph`, but instead a graph-data-structure instance. See [graph-data-structure](https://www.npmjs.com/package/graph-data-structure) for usage information and help.

| Name                    | Type                                                                                                     |
| :---------------------- | :------------------------------------------------------------------------------------------------------- |
| `addEdge`               | (`u`: `string`, `v`: `string`, `weight?`: `number`) => `any`                                             |
| `addNode`               | (`node`: `string`) => `any`                                                                              |
| `adjacent`              | (`node`: `string`) => `string`[]                                                                         |
| `depthFirstSearch`      | (`sourceNodes?`: `string`[], `includeSourceNodes?`: `boolean`, `errorOnCycle?`: `boolean`) => `string`[] |
| `deserialize`           | (`serialized`: [`Serialized`](/docs/core/api/interfaces/Serialized/)) => `any`                           |
| `getEdgeWeight`         | (`u`: `string`, `v`: `string`) => `number`                                                               |
| `hasCycle`              | () => `boolean`                                                                                          |
| `hasEdge`               | (`u`: `string`, `v`: `string`) => `boolean`                                                              |
| `indegree`              | (`node`: `string`) => `number`                                                                           |
| `lowestCommonAncestors` | (`node1`: `string`, `node2`: `string`) => `string`[]                                                     |
| `nodes`                 | () => `string`[]                                                                                         |
| `outdegree`             | (`node`: `string`) => `number`                                                                           |
| `removeEdge`            | (`u`: `string`, `v`: `string`) => `any`                                                                  |
| `removeNode`            | (`node`: `string`) => `any`                                                                              |
| `serialize`             | () => [`Serialized`](/docs/core/api/interfaces/Serialized/)                                              |
| `setEdgeWeight`         | (`u`: `string`, `v`: `string`, `weight`: `number`) => `any`                                              |
| `shortestPath`          | (`source`: `string`, `destination`: `string`) => `string`[] & { `weight?`: `number` }                    |
| `topologicalSort`       | (`sourceNodes?`: `string`[], `includeSourceNodes?`: `boolean`) => `string`[]                             |

#### Defined in

[modules/graph/src/Graph.ts:236](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L236)
