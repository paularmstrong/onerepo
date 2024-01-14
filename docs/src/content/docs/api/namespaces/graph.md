---
title: 'oneRepo API: graph'
sidebar:
  label: graph
---

<!--

DO NOT EDIT BELOW THIS LINE.
All content is auto-generated using a oneRepo command:

  $ one docs typedoc

-->

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<57caaced5f9c0f0d6f9b3ee5c1e679e8>> -->

## Classes

### Graph

The oneRepo Graph is a representation of the entire repository’s workspaces and how they depend upon each other. Most commonly, you will want to use the graph to get lists of workspaces that either depend on some input or are dependencies thereof:

```ts
const workspacesToCheck = graph.affected('tacos');
for (const ws of workspacesToCheck) {
	// verify no issues based on changes
}
```

The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.

#### Accessors

##### packageManager

```ts
get packageManager(): PackageManager
```

Get the package manager that this Graph depends on.

###### Returns

[`PackageManager`](../../#packagemanager)

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L56)

##### root

```ts
get root(): Workspace
```

Get the workspace that is at the root of the repository.

###### Returns

[`Workspace`](#workspace)

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L52)

##### serialized

```ts
get serialized(): Serialized
```

Get a serialized representation of the graph

###### Returns

[`Serialized`](#serialized-1)

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L44)

##### workspaces

```ts
get workspaces(): Workspace[]
```

All workspaces that are part of the repository graph.

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L48)

#### Methods

##### affected()

```ts
affected<T>(source, type?): Workspace[]
```

Get a list of workspaces that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`.

```ts
const dependents = graph.dependents(sources, true);
const affected = graph.affected(sources);

assert.isEqual(dependents, affecteed);
```

###### Type parameters

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

###### Parameters

| Parameter | Type         | Description                                 |
| :-------- | :----------- | :------------------------------------------ |
| `source`  | `T` \| `T`[] | -                                           |
| `type`?   | `DepType`    | Filter the dependents to a dependency type. |

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L94)

##### dependencies()

```ts
dependencies<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get a list of workspaces that are dependencies of the given input sources.

```ts
const tacoDependencies = graph.dependencies('tacos');
```

###### Type parameters

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

###### Parameters

| Parameter      | Type         | Description                                                                      |
| :------------- | :----------- | :------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[] | One or more workspaces by name or `Workspace` instance                           |
| `includeSelf`? | `boolean`    | Whether to include the `Workspaces` for the input `sources` in the return array. |
| `type`?        | `DepType`    | Filter the dependencies to a dependency type.                                    |

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L80)

##### dependents()

```ts
dependents<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get a list of workspaces that depend on the given input sources.

```ts
const tacoDependents = graph.dependents('tacos');
```

###### Type parameters

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

###### Parameters

| Parameter      | Type         | Description                                                                      |
| :------------- | :----------- | :------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[] | One or more workspaces by name or `Workspace` instance                           |
| `includeSelf`? | `boolean`    | Whether to include the `Workspaces` for the input `sources` in the return array. |
| `type`?        | `DepType`    | Filter the dependents to a dependency type.                                      |

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L68)

##### getAllByLocation()

```ts
getAllByLocation(locations): Workspace[]
```

Get all workspaces given an array of filepaths.

```ts
const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
```

###### Parameters

| Parameter   | Type       | Description                                                   |
| :---------- | :--------- | :------------------------------------------------------------ |
| `locations` | `string`[] | A list of filepath strings. May be file URLs or string paths. |

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L139)

##### getAllByName()

```ts
getAllByName(names): Workspace[]
```

Get a list of workspaces by name or alias

```ts
const workspaces = graph.getAllByName(['tacos', 'burritos']);
```

###### Parameters

| Parameter | Type       | Description                                                                                  |
| :-------- | :--------- | :------------------------------------------------------------------------------------------- |
| `names`   | `string`[] | A list of workspace [Workspace#name](#name)s or any available [Workspace#aliases](#aliases). |

###### Returns

[`Workspace`](#workspace)[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L114)

##### getByLocation()

```ts
getByLocation(location): Workspace
```

Get the equivalent Workspace for a filepath. This can be any location within a Workspace, not just its root.

```ts
// in Node.js
graph.getByLocation(__dirname);

// in pure ESM
graph.getByLocation(import.meta.url);
```

###### Parameters

| Parameter  | Type     | Description                                          |
| :--------- | :------- | :--------------------------------------------------- |
| `location` | `string` | A filepath string. May be a file URL or string path. |

###### Returns

[`Workspace`](#workspace)

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L129)

##### getByName()

```ts
getByName(name): Workspace
```

Get a workspace by string name. This can be either the full package name or one of its `aliases`

```ts
const workspace = graph.getByName('my-cool-package');
```

###### Parameters

| Parameter | Type     | Description                                                                           |
| :-------- | :------- | :------------------------------------------------------------------------------------ |
| `name`    | `string` | A Workspace’s [Workspace#name](#name) or any available [Workspace#aliases](#aliases). |

###### Returns

[`Workspace`](#workspace)

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L104)

##### isolatedGraph()

```ts
isolatedGraph(sources, type?): {
  addEdge: (u, v, weight?) => any;
  addNode: (node) => any;
  adjacent: (node) => string[];
  depthFirstSearch: (sourceNodes?, includeSourceNodes?, errorOnCycle?) => string[];
  deserialize: (serialized) => any;
  getEdgeWeight: (u, v) => number;
  hasCycle: () => boolean;
  hasEdge: (u, v) => boolean;
  indegree: (node) => number;
  lowestCommonAncestors: (node1, node2) => string[];
  nodes: () => string[];
  outdegree: (node) => number;
  removeEdge: (u, v) => any;
  removeNode: (node) => any;
  serialize: () => Serialized;
  setEdgeWeight: (u, v, weight) => any;
  shortestPath: (source, destination) => string[] & {
     weight: number;
  };
  shortestPaths: (source, destination) => string[] & {
     weight: number;
  }[];
  topologicalSort: (sourceNodes?, includeSourceNodes?) => string[];
}
```

Get an isolated graph of dependents from the list of sources

###### Parameters

| Parameter | Type                        | Description                                                                                  |
| :-------- | :-------------------------- | :------------------------------------------------------------------------------------------- |
| `sources` | [`Workspace`](#workspace)[] | A list of workspace [Workspace#name](#name)s or any available [Workspace#aliases](#aliases). |
| `type`?   | `DepType`                   | Filter the graph to a dependency type.                                                       |

###### Returns

`Object`

This does not return a oneRepo `Graph`, but instead a graph-data-structure instance. See [graph-data-structure](https://www.npmjs.com/package/graph-data-structure) for usage information and help.

> ###### addEdge
>
> ```ts
> addEdge: (u, v, weight?) => any;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `u`       | `string` |
> | `v`       | `string` |
> | `weight`? | `number` |
>
> ###### Returns
>
> `any`
>
> ###### addNode
>
> ```ts
> addNode: (node) => any;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node`    | `string` |
>
> ###### Returns
>
> `any`
>
> ###### adjacent
>
> ```ts
> adjacent: (node) => string[];
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node`    | `string` |
>
> ###### Returns
>
> `string`[]
>
> ###### depthFirstSearch
>
> ```ts
> depthFirstSearch: (sourceNodes?, includeSourceNodes?, errorOnCycle?) => string[];
> ```
>
> ###### Parameters
>
> | Parameter             | Type       |
> | :-------------------- | :--------- |
> | `sourceNodes`?        | `string`[] |
> | `includeSourceNodes`? | `boolean`  |
> | `errorOnCycle`?       | `boolean`  |
>
> ###### Returns
>
> `string`[]
>
> ###### deserialize
>
> ```ts
> deserialize: (serialized) => any;
> ```
>
> ###### Parameters
>
> | Parameter    | Type                          |
> | :----------- | :---------------------------- |
> | `serialized` | [`Serialized`](#serialized-1) |
>
> ###### Returns
>
> `any`
>
> ###### getEdgeWeight
>
> ```ts
> getEdgeWeight: (u, v) => number;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `u`       | `string` |
> | `v`       | `string` |
>
> ###### Returns
>
> `number`
>
> ###### hasCycle
>
> ```ts
> hasCycle: () => boolean;
> ```
>
> ###### Returns
>
> `boolean`
>
> ###### hasEdge
>
> ```ts
> hasEdge: (u, v) => boolean;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `u`       | `string` |
> | `v`       | `string` |
>
> ###### Returns
>
> `boolean`
>
> ###### indegree
>
> ```ts
> indegree: (node) => number;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node`    | `string` |
>
> ###### Returns
>
> `number`
>
> ###### lowestCommonAncestors
>
> ```ts
> lowestCommonAncestors: (node1, node2) => string[];
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node1`   | `string` |
> | `node2`   | `string` |
>
> ###### Returns
>
> `string`[]
>
> ###### nodes
>
> ```ts
> nodes: () => string[];
> ```
>
> ###### Returns
>
> `string`[]
>
> ###### outdegree
>
> ```ts
> outdegree: (node) => number;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node`    | `string` |
>
> ###### Returns
>
> `number`
>
> ###### removeEdge
>
> ```ts
> removeEdge: (u, v) => any;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `u`       | `string` |
> | `v`       | `string` |
>
> ###### Returns
>
> `any`
>
> ###### removeNode
>
> ```ts
> removeNode: (node) => any;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `node`    | `string` |
>
> ###### Returns
>
> `any`
>
> ###### serialize
>
> ```ts
> serialize: () => Serialized;
> ```
>
> ###### Returns
>
> [`Serialized`](#serialized-1)
>
> ###### setEdgeWeight
>
> ```ts
> setEdgeWeight: (u, v, weight) => any;
> ```
>
> ###### Parameters
>
> | Parameter | Type     |
> | :-------- | :------- |
> | `u`       | `string` |
> | `v`       | `string` |
> | `weight`  | `number` |
>
> ###### Returns
>
> `any`
>
> ###### shortestPath
>
> ```ts
> shortestPath: (source, destination) => string[] & {
> weight: number;
> };
> ```
>
> ###### Parameters
>
> | Parameter     | Type     |
> | :------------ | :------- |
> | `source`      | `string` |
> | `destination` | `string` |
>
> ###### Returns
>
> `string`[] & \{ `weight`: `number`; }
>
> ###### shortestPaths
>
> ```ts
> shortestPaths: (source, destination) => string[] & {
> weight: number;
> }[];
> ```
>
> ###### Parameters
>
> | Parameter     | Type     |
> | :------------ | :------- |
> | `source`      | `string` |
> | `destination` | `string` |
>
> ###### Returns
>
> `string`[] & \{ `weight`: `number`; }[]
>
> ###### topologicalSort
>
> ```ts
> topologicalSort: (sourceNodes?, includeSourceNodes?) => string[];
> ```
>
> ###### Parameters
>
> | Parameter             | Type       |
> | :-------------------- | :--------- |
> | `sourceNodes`?        | `string`[] |
> | `includeSourceNodes`? | `boolean`  |
>
> ###### Returns
>
> `string`[]

###### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L147)

---

### Workspace

#### Accessors

##### aliases

```ts
get aliases(): string[]
```

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

###### Returns

`string`[]

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L40)

##### codeowners

```ts
get codeowners(): Required<Record<string, string[]>>
```

###### Returns

`Required`\<`Record`\<`string`, `string`[]\>\>

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L73)

##### config

```ts
get config(): WorkspaceConfig
```

Get the workspace's configuration

###### Returns

[`WorkspaceConfig`](../../#workspaceconfigcustomlifecycles)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L66)

##### dependencies

```ts
get dependencies(): Record<string, string>
```

Get the `package.json` defined production dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L46)

##### description

```ts
get description(): undefined | string
```

Canonical to the `package.json` `"description"` field.

###### Returns

`undefined` \| `string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L16)

##### devDependencies

```ts
get devDependencies(): Record<string, string>
```

Get the `package.json` defined development dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L52)

##### isRoot

```ts
get isRoot(): boolean
```

Whether or not this workspace is the root of the repository / Graph.

###### Returns

`boolean`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L20)

##### location

```ts
get location(): string
```

Absolute path on the current filesystem to the workspace.

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L24)

##### main

```ts
get main(): string
```

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L26)

##### name

```ts
get name(): string
```

The full `name` of the Workspace, as defined in its `package.json`

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L12)

##### packageJson

```ts
get packageJson(): PackageJson
```

A full copy of the `package.json` file for the Workspace.

###### Returns

[`PackageJson`](#packagejson-1)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L30)

##### peerDependencies

```ts
get peerDependencies(): Record<string, string>
```

Get the `package.json` defined peer dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L58)

##### private

```ts
get private(): boolean
```

If a workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.

###### Returns

`boolean`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L62)

##### publishConfig

```ts
get publishConfig(): PublishConfig
```

###### Returns

[`PublishConfig`](#publishconfig-1)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L31)

##### scope

```ts
get scope(): string
```

Get module name scope if there is one, eg `@onerepo`

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L35)

##### tasks

```ts
get tasks(): Partial<Record<Lifecycle, Tasks>>
```

Get the task configuration as defined in the `onerepo.config.js` file at the root of the workspace.

###### Returns

`Partial`\<`Record`\<[`Lifecycle`](../../#lifecycle), [`Tasks`](../../#tasks)\>\>

If a config does not exist, an empty object will be given.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L72)

##### version

```ts
get version(): undefined | string
```

###### Returns

`undefined` \| `string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L25)

#### Methods

##### getCodeowners()

```ts
getCodeowners(filepath): string[]
```

###### Parameters

| Parameter  | Type     |
| :--------- | :------- |
| `filepath` | `string` |

###### Returns

`string`[]

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L74)

##### getTasks()

```ts
getTasks(lifecycle): Required<Tasks>
```

Get a list of Workspace tasks for the given lifecycle

###### Parameters

| Parameter   | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

###### Returns

`Required`\<[`Tasks`](../../#tasks)\>

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L78)

##### relative()

```ts
relative(to): string
```

Get the relative path of an absolute path to the workspace’s location root

```ts
const relativePath = workspace.relative('/some/absolute/path');
```

###### Parameters

| Parameter | Type     | Description       |
| :-------- | :------- | :---------------- |
| `to`      | `string` | Absolute filepath |

###### Returns

`string`

Relative path to the workspace’s root location.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L100)

##### resolve()

```ts
resolve(...pathSegments): string
```

Resolve a full filepath within the workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).

```ts
const main = workspace.resolve(workspace.main);
```

###### Parameters

| Parameter         | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| ...`pathSegments` | `string`[] | A sequence of paths or path segments |

###### Returns

`string`

Absolute path based on the input path segments

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L89)

## Interfaces

### Serialized

#### Properties

| Property | Type                                                               |
| :------- | :----------------------------------------------------------------- |
| `links`  | \{ `source`: `string`; `target`: `string`; `weight`: `number`; }[] |
| `nodes`  | \{ `id`: `string`; }[]                                             |

## Type Aliases

### PackageJson

```ts
type PackageJson: {
  alias: string[];
  author: string | Person;
  bin: string | Record<string, string>;
  bugs: {
     email: string;
     url: string;
  };
  bundleDependencies: string[];
  contributors: (Person | string)[];
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
  files: string[];
  homepage: string;
  keywords: string[];
  license: string;
  main: string;
  name: string;
  optionalDependencies: string[];
  os: string[];
  overrides: Record<string, string>;
  packageManager: string;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: Record<string, {
     optional: boolean;
  }>;
  scripts: Record<string, string>;
  version: string;
};
```

#### Type declaration

##### alias?

```ts
alias?: string[];
```

##### author?

```ts
author?: string | Person;
```

##### bin?

```ts
bin?: string | Record<string, string>;
```

##### bugs?

```ts
bugs?: {
  email: string;
  url: string;
};
```

##### bugs.email?

```ts
bugs.email?: string;
```

##### bugs.url?

```ts
bugs.url?: string;
```

##### bundleDependencies?

```ts
bundleDependencies?: string[];
```

##### contributors?

```ts
contributors?: (Person | string)[];
```

##### dependencies?

```ts
dependencies?: Record<string, string>;
```

##### description?

```ts
description?: string;
```

##### devDependencies?

```ts
devDependencies?: Record<string, string>;
```

##### engines?

```ts
engines?: Record<string, string>;
```

##### files?

```ts
files?: string[];
```

##### homepage?

```ts
homepage?: string;
```

##### keywords?

```ts
keywords?: string[];
```

##### license?

```ts
license?: string;
```

##### main?

```ts
main?: string;
```

##### name

```ts
name: string;
```

##### optionalDependencies?

```ts
optionalDependencies?: string[];
```

##### os?

```ts
os?: string[];
```

##### overrides?

```ts
overrides?: Record<string, string>;
```

##### packageManager?

```ts
packageManager?: string;
```

##### peerDependencies?

```ts
peerDependencies?: Record<string, string>;
```

##### peerDependenciesMeta?

```ts
peerDependenciesMeta?: Record<string, {
  optional: boolean;
}>;
```

##### scripts?

```ts
scripts?: Record<string, string>;
```

##### version?

```ts
version?: string;
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L107)

---

### PackageJsonWithLocation

```ts
type PackageJsonWithLocation: PackageJson & {
  location: string;
};
```

#### Type declaration

##### location

```ts
location: string;
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L152)

---

### Person

```ts
type Person: {
  email: string;
  name: string;
  url: string;
};
```

#### Type declaration

##### email?

```ts
email?: string;
```

##### name?

```ts
name?: string;
```

##### url?

```ts
url?: string;
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L102)

---

### PrivatePackageJson

```ts
type PrivatePackageJson: PackageJson & {
  license: "UNLICENSED";
  private: true;
  workspaces: string[];
};
```

#### Type declaration

##### license?

```ts
license?: "UNLICENSED";
```

##### private

```ts
private: true;
```

##### workspaces?

```ts
workspaces?: string[];
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L138)

---

### PublicPackageJson

```ts
type PublicPackageJson: PackageJson & {
  private: false;
  publishConfig: PublishConfig;
};
```

#### Type declaration

##### private?

```ts
private?: false;
```

##### publishConfig?

```ts
publishConfig?: PublishConfig;
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L148)

---

### PublishConfig

```ts
type PublishConfig: {
[key: string]: unknown;   access: "public" | "restricted";
  registry: string;
};
```

#### Index signature

\[`key`: `string`\]: `unknown`

#### Type declaration

##### access?

```ts
access?: "public" | "restricted";
```

##### registry?

```ts
registry?: string;
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L143)

## Variables

### DependencyType

```ts
const DependencyType: {
	DEV: 2;
	PEER: 1;
	PROD: 3;
};
```

#### Type declaration

##### DEV

```ts
readonly DEV: 2;
```

Development-only dependency (defined in `devDependencies` keys of `package.json`)

##### PEER

```ts
readonly PEER: 1;
```

Peer dependency (defined in `peerDependencies` key of `package.json`)

##### PROD

```ts
readonly PROD: 3;
```

Production dependency (defined in `dependencies` of `package.json`)

#### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L7)

<!-- end-onerepo-sentinel -->
