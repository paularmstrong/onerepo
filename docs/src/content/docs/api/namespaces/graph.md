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
<!-- @generated SignedSource<<e773f98f7dc16ed691aa7cf4d8387d75>> -->

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

> | Member                  | Type                                                                   | Description |
> | :---------------------- | :--------------------------------------------------------------------- | :---------- |
> | `addEdge`               | (`u`, `v`, `weight`?) => `any`                                         | -           |
> | `addNode`               | (`node`) => `any`                                                      | -           |
> | `adjacent`              | (`node`) => `string`[]                                                 | -           |
> | `depthFirstSearch`      | (`sourceNodes`?, `includeSourceNodes`?, `errorOnCycle`?) => `string`[] | -           |
> | `deserialize`           | (`serialized`) => `any`                                                | -           |
> | `getEdgeWeight`         | (`u`, `v`) => `number`                                                 | -           |
> | `hasCycle`              | () => `boolean`                                                        | -           |
> | `hasEdge`               | (`u`, `v`) => `boolean`                                                | -           |
> | `indegree`              | (`node`) => `number`                                                   | -           |
> | `lowestCommonAncestors` | (`node1`, `node2`) => `string`[]                                       | -           |
> | `nodes`                 | () => `string`[]                                                       | -           |
> | `outdegree`             | (`node`) => `number`                                                   | -           |
> | `removeEdge`            | (`u`, `v`) => `any`                                                    | -           |
> | `removeNode`            | (`node`) => `any`                                                      | -           |
> | `serialize`             | () => [`Serialized`](#serialized-1)                                    | -           |
> | `setEdgeWeight`         | (`u`, `v`, `weight`) => `any`                                          | -           |
> | `shortestPath`          | (`source`, `destination`) => `string`[] & \{ `weight`: `number`; }     | -           |
> | `shortestPaths`         | (`source`, `destination`) => `string`[] & \{ `weight`: `number`; }[]   | -           |
> | `topologicalSort`       | (`sourceNodes`?, `includeSourceNodes`?) => `string`[]                  | -           |

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

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L39)

##### codeowners

```ts
get codeowners(): Codeowners
```

###### Returns

`Codeowners`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L72)

##### config

```ts
get config(): WorkspaceConfig
```

Get the workspace's configuration

###### Returns

[`WorkspaceConfig`](#workspaceconfig)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L65)

##### dependencies

```ts
get dependencies(): Record<string, string>
```

Get the `package.json` defined production dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L45)

##### description

```ts
get description(): undefined | string
```

Canonical to the `package.json` `"description"` field.

###### Returns

`undefined` \| `string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L15)

##### devDependencies

```ts
get devDependencies(): Record<string, string>
```

Get the `package.json` defined development dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L51)

##### isRoot

```ts
get isRoot(): boolean
```

Whether or not this workspace is the root of the repository / Graph.

###### Returns

`boolean`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L19)

##### location

```ts
get location(): string
```

Absolute path on the current filesystem to the workspace.

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L23)

##### main

```ts
get main(): string
```

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L25)

##### name

```ts
get name(): string
```

The full `name` of the Workspace, as defined in its `package.json`

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L11)

##### packageJson

```ts
get packageJson(): PackageJson
```

A full copy of the `package.json` file for the Workspace.

###### Returns

[`PackageJson`](#packagejson-1)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L29)

##### peerDependencies

```ts
get peerDependencies(): Record<string, string>
```

Get the `package.json` defined peer dependencies for the workspace.

###### Returns

`Record`\<`string`, `string`\>

Map of modules to their version.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L57)

##### private

```ts
get private(): boolean
```

If a workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.

###### Returns

`boolean`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L61)

##### publishConfig

```ts
get publishConfig(): PublishConfig
```

###### Returns

[`PublishConfig`](#publishconfig-1)

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L30)

##### scope

```ts
get scope(): string
```

Get module name scope if there is one, eg `@onerepo`

###### Returns

`string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L34)

##### tasks

```ts
get tasks(): Partial<Record<Lifecycle, Tasks>>
```

Get the task configuration as defined in the `onerepo.config.js` file at the root of the workspace.

###### Returns

`Partial`\<`Record`\<[`Lifecycle`](#lifecycle), [`Tasks`](#tasks-1)\>\>

If a config does not exist, an empty object will be given.

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L71)

##### version

```ts
get version(): undefined | string
```

###### Returns

`undefined` \| `string`

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L24)

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

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L73)

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

`Required`\<[`Tasks`](#tasks-1)\>

###### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L77)

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

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L99)

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

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L88)

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

| Member                 | Type                                              | Description |
| :--------------------- | :------------------------------------------------ | :---------- |
| `alias`                | `string`[]                                        | -           |
| `author`               | `string` \| [`Person`](#person)                   | -           |
| `bin`                  | `string` \| `Record`\<`string`, `string`\>        | -           |
| `bugs`                 | \{ `email`: `string`; `url`: `string`; }          | -           |
| `bugs.email`           | `string`                                          | -           |
| `bugs.url`             | `string`                                          | -           |
| `bundleDependencies`   | `string`[]                                        | -           |
| `contributors`         | ([`Person`](#person) \| `string`)[]               | -           |
| `dependencies`         | `Record`\<`string`, `string`\>                    | -           |
| `description`          | `string`                                          | -           |
| `devDependencies`      | `Record`\<`string`, `string`\>                    | -           |
| `engines`              | `Record`\<`string`, `string`\>                    | -           |
| `files`                | `string`[]                                        | -           |
| `homepage`             | `string`                                          | -           |
| `keywords`             | `string`[]                                        | -           |
| `license`              | `string`                                          | -           |
| `main`                 | `string`                                          | -           |
| `name`                 | `string`                                          | -           |
| `optionalDependencies` | `string`[]                                        | -           |
| `os`                   | `string`[]                                        | -           |
| `overrides`            | `Record`\<`string`, `string`\>                    | -           |
| `packageManager`       | `string`                                          | -           |
| `peerDependencies`     | `Record`\<`string`, `string`\>                    | -           |
| `peerDependenciesMeta` | `Record`\<`string`, \{ `optional`: `boolean`; }\> | -           |
| `scripts`              | `Record`\<`string`, `string`\>                    | -           |
| `version`              | `string`                                          | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L106)

---

### PackageJsonWithLocation

```ts
type PackageJsonWithLocation: PackageJson & {
  location: string;
};
```

#### Type declaration

| Member     | Type     | Description |
| :--------- | :------- | :---------- |
| `location` | `string` | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L151)

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

| Member  | Type     | Description |
| :------ | :------- | :---------- |
| `email` | `string` | -           |
| `name`  | `string` | -           |
| `url`   | `string` | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L101)

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

| Member       | Type           | Description |
| :----------- | :------------- | :---------- |
| `license`    | `"UNLICENSED"` | -           |
| `private`    | `true`         | -           |
| `workspaces` | `string`[]     | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L137)

---

### PublicPackageJson

```ts
type PublicPackageJson: PackageJson & {
  private: false;
  publishConfig: PublishConfig;
};
```

#### Type declaration

| Member          | Type                                | Description |
| :-------------- | :---------------------------------- | :---------- |
| `private`       | `false`                             | -           |
| `publishConfig` | [`PublishConfig`](#publishconfig-1) | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L147)

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

| Member     | Type                         | Description |
| :--------- | :--------------------------- | :---------- |
| `access`   | `"public"` \| `"restricted"` | -           |
| `registry` | `string`                     | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L142)

---

### WorkspaceConfig

```ts
type WorkspaceConfig: {
  codeowners: Codeowners;
  root: never;
  tasks: TaskConfig;
};
```

#### Type declaration

| Member       | Type                         | Description                                                                                                                               |
| :----------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `codeowners` | `Codeowners`                 | Map of paths to array of owners<br /><br />**Default**<br />`{}`                                                                          |
| `root`       | `never`                      | -                                                                                                                                         |
| `tasks`      | [`TaskConfig`](#taskconfigl) | Tasks for this workspace. These will be merged with global tasks and any other affected workspace tasks.<br /><br />**Default**<br />`{}` |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L198)

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

| Member | Type | Description                                                                       |
| :----- | :--- | :-------------------------------------------------------------------------------- |
| `DEV`  | `2`  | Development-only dependency (defined in `devDependencies` keys of `package.json`) |
| `PEER` | `1`  | Peer dependency (defined in `peerDependencies` key of `package.json`)             |
| `PROD` | `3`  | Production dependency (defined in `dependencies` of `package.json`)               |

#### Source

[modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts#L7)

## Tasks

### Lifecycle

```ts
type Lifecycle:
  | "pre-commit"
  | "post-commit"
  | "post-checkout"
  | "pre-merge"
  | "post-merge"
  | "build"
  | "deploy"
  | "publish";
```

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L193)

---

### Task

```ts
type Task: string | TaskDef | string[];
```

A Task can either be a string or TaskDef object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a [`TaskDef`](#taskdef).

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L182)

---

### TaskConfig\<L\>

```ts
type TaskConfig<L>: Partial<Record<Lifecycle | L, Tasks>>;
```

#### Type parameters

| Type parameter       | Value   |
| :------------------- | :------ |
| `L` extends `string` | `never` |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L197)

---

### TaskDef

```ts
type TaskDef: {
  cmd: string | string[];
  match: string | string[];
  meta: Record<string, unknown>;
};
```

#### Type declaration

| Member  | Type                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------ | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cmd`   | `string` \| `string`[]          | String command(s) to run. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.<br /><br />The commands can use replaced tokens:<br />- `$0`: the oneRepo CLI for your repository<br />- `${workspaces}`: replaced with a space-separated list of workspace names necessary for the given lifecycle |
| `match` | `string` \| `string`[]          | Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.                                                                                                                                                                                                                                               |
| `meta`  | `Record`\<`string`, `unknown`\> | Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.                                                                                                                                                                                                      |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L157)

---

### Tasks

```ts
type Tasks: {
  parallel: Task[];
  serial: Task[];
};
```

#### Type declaration

| Member     | Type              | Description |
| :--------- | :---------------- | :---------- |
| `parallel` | [`Task`](#task)[] | -           |
| `serial`   | [`Task`](#task)[] | -           |

#### Source

[modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts#L186)

<!-- end-onerepo-sentinel -->
