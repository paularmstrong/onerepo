---
title: oneRepo API
description: Full API documentation for oneRepo.
---

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<dd41a71239d56e891775371f7dda6eda>> -->

## Namespaces

| Namespace                                | Description |
| ---------------------------------------- | ----------- |
| [builders](onerepo/namespaces/builders/) | -           |
| [file](onerepo/namespaces/file/)         | -           |
| [git](onerepo/namespaces/git/)           | -           |

## Classes

### BatchError

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new BatchError(errors, options?): BatchError;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter  | Type                                                  |
| ---------- | ----------------------------------------------------- |
| `errors`   | (`string` \| [`SubprocessError`](#subprocesserror))[] |
| `options?` | `ErrorOptions`                                        |

**Returns:** [`BatchError`](#batcherror)

###### Overrides

```ts
Error.constructor;
```

#### Properties

##### errors

```ts
errors: (string | SubprocessError)[];
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### Graph

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Constructors

##### Constructor

```ts
new Graph(location, packageManager?): Graph;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter         | Type     |
| ----------------- | -------- |
| `location`        | `string` |
| `packageManager?` | `string` |

**Returns:** [`Graph`](#graph)

#### Accessors

##### packageManager

###### Get Signature

```ts
get packageManager(): PackageManager;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Returns:** [`PackageManager`](#packagemanager-1)

##### root

###### Get Signature

```ts
get root(): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Returns:** [`Workspace`](#workspace)

##### serialized

###### Get Signature

```ts
get serialized(): Serialized;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Returns:** [`Serialized`](#serialized-1)

##### workspaces

###### Get Signature

```ts
get workspaces(): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Returns:** [`Workspace`](#workspace)[]

#### Methods

##### affected()

```ts
affected<T>(source, type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `source`  | `T` \| `T`[]          |
| `type?`   | [`DepType`](#deptype) |

**Returns:** [`Workspace`](#workspace)[]

##### construct()

```ts
construct(packageJson, workspaces?): Promise<void>;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter     | Type                            |
| ------------- | ------------------------------- |
| `packageJson` | [`PackageJson`](#packagejson-1) |
| `workspaces?` | `string`[]                      |

**Returns:** `Promise`\<`void`\>

##### dependencies()

```ts
dependencies<T>(
   sources?,
   includeSelf?,
   type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  |
| -------------- | --------------------- |
| `sources?`     | `T` \| `T`[]          |
| `includeSelf?` | `boolean`             |
| `type?`        | [`DepType`](#deptype) |

**Returns:** [`Workspace`](#workspace)[]

##### dependents()

```ts
dependents<T>(
   sources?,
   includeSelf?,
   type?): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

###### Type Parameters

| Type Parameter                                      |
| --------------------------------------------------- |
| `T` _extends_ `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  |
| -------------- | --------------------- |
| `sources?`     | `T` \| `T`[]          |
| `includeSelf?` | `boolean`             |
| `type?`        | [`DepType`](#deptype) |

**Returns:** [`Workspace`](#workspace)[]

##### getAllByLocation()

```ts
getAllByLocation(locations): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter   | Type       |
| ----------- | ---------- |
| `locations` | `string`[] |

**Returns:** [`Workspace`](#workspace)[]

##### getAllByName()

```ts
getAllByName(names): Workspace[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter | Type       |
| --------- | ---------- |
| `names`   | `string`[] |

**Returns:** [`Workspace`](#workspace)[]

##### getByLocation()

```ts
getByLocation(location): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter  | Type     |
| ---------- | -------- |
| `location` | `string` |

**Returns:** [`Workspace`](#workspace)

##### getByName()

```ts
getByName(name): Workspace;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `name`    | `string` |

**Returns:** [`Workspace`](#workspace)

##### isolatedGraph()

```ts
isolatedGraph(sources, type?): {
};
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)  
**Parameters:**

| Parameter | Type                        |
| --------- | --------------------------- |
| `sources` | [`Workspace`](#workspace)[] |
| `type?`   | [`DepType`](#deptype)       |

**Returns:** ```ts
{
}

````

***

### Logger

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Constructors

##### Constructor

```ts
new Logger(options): Logger;
````

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter | Type                              |
| --------- | --------------------------------- |
| `options` | [`LoggerOptions`](#loggeroptions) |

**Returns:** [`Logger`](#logger)

#### Accessors

##### hasError

###### Get Signature

```ts
get hasError(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

##### hasInfo

###### Get Signature

```ts
get hasInfo(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

##### hasLog

###### Get Signature

```ts
get hasLog(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

##### hasWarning

###### Get Signature

```ts
get hasWarning(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

##### stream

###### Set Signature

```ts
set stream(stream): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter | Type       |
| --------- | ---------- |
| `stream`  | `Writable` |

**Returns:** `void`

##### verbosity

###### Get Signature

```ts
get verbosity(): Verbosity;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** [`Verbosity`](#verbosity-4)

###### Set Signature

```ts
set verbosity(value): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter | Type                        |
| --------- | --------------------------- |
| `value`   | [`Verbosity`](#verbosity-4) |

**Returns:** `void`

##### writable

###### Get Signature

```ts
get writable(): boolean;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `boolean`

#### Methods

##### createStep()

```ts
createStep(name, __namedParameters?): LogStep;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter                          | Type                               |
| ---------------------------------- | ---------------------------------- |
| `name`                             | `string`                           |
| `__namedParameters?`               | \{ `writePrefixes?`: `boolean`; \} |
| `__namedParameters.writePrefixes?` | `boolean`                          |

**Returns:** [`LogStep`](#logstep)

##### debug()

```ts
debug(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### end()

```ts
end(): Promise<void>;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `Promise`\<`void`\>

##### error()

```ts
error(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### info()

```ts
info(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### log()

```ts
log(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### pause()

```ts
pause(write?): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter | Type      |
| --------- | --------- |
| `write?`  | `boolean` |

**Returns:** `void`

##### timing()

```ts
timing(start, end): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `start`   | `string` |
| `end`     | `string` |

**Returns:** `void`

##### unpause()

```ts
unpause(): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Returns:** `void`

##### warn()

```ts
warn(contents): void;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

---

### LogStep

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Constructors

##### Constructor

```ts
new LogStep(name, __namedParameters): LogStep;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter           | Type          |
| ------------------- | ------------- |
| `name`              | `string`      |
| `__namedParameters` | `StepOptions` |

**Returns:** [`LogStep`](#logstep)

#### Properties

##### hasError

```ts
hasError: boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasInfo

```ts
hasInfo: boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasLog

```ts
hasLog: boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasWarning

```ts
hasWarning: boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Accessors

##### active

###### Get Signature

```ts
get active(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `boolean`

##### name

###### Get Signature

```ts
get name(): string;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `string`

##### status

###### Get Signature

```ts
get status(): string[];
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `string`[]

##### verbosity

###### Get Signature

```ts
get verbosity(): number;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `number`

###### Set Signature

```ts
set verbosity(verbosity): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter   | Type     |
| ----------- | -------- |
| `verbosity` | `number` |

**Returns:** `void`

##### writable

###### Get Signature

```ts
get writable(): boolean;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `boolean`

#### Methods

##### activate()

```ts
activate(enableWrite?): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter      | Type      |
| -------------- | --------- |
| `enableWrite?` | `boolean` |

**Returns:** `void`

##### deactivate()

```ts
deactivate(): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `void`

##### debug()

```ts
debug(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### end()

```ts
end(): Promise<void>;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `Promise`\<`void`\>

##### error()

```ts
error(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### flush()

```ts
flush(): Promise<void>;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Returns:** `Promise`\<`void`\>

##### info()

```ts
info(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### log()

```ts
log(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

##### timing()

```ts
timing(start, end): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `start`   | `string` |
| `end`     | `string` |

**Returns:** `void`

##### warn()

```ts
warn(contents): void;
```

**Defined in:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)  
**Parameters:**

| Parameter  | Type      |
| ---------- | --------- |
| `contents` | `unknown` |

**Returns:** `void`

---

### SubprocessError

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new SubprocessError(message, options?): SubprocessError;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter  | Type           |
| ---------- | -------------- |
| `message`  | `string`       |
| `options?` | `ErrorOptions` |

**Returns:** [`SubprocessError`](#subprocesserror)

###### Overrides

```ts
Error.constructor;
```

---

### Workspace

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

#### Constructors

##### Constructor

```ts
new Workspace(
   rootLocation,
   location,
   packageJson,
   config): Workspace;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter      | Type                                                                                 |
| -------------- | ------------------------------------------------------------------------------------ |
| `rootLocation` | `string`                                                                             |
| `location`     | `string`                                                                             |
| `packageJson`  | [`PackageJson`](#packagejson-1)                                                      |
| `config`       | `Required`\<[`RootConfig`](#rootconfig) \| [`WorkspaceConfig`](#workspaceconfig-1)\> |

**Returns:** [`Workspace`](#workspace)

#### Accessors

##### aliases

###### Get Signature

```ts
get aliases(): string[];
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`[]

##### codeowners

###### Get Signature

```ts
get codeowners(): NonNullable<Required<WorkspaceConfig["codeowners"]>>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `NonNullable`\<`Required`\<[`WorkspaceConfig`](#workspaceconfig-1)\[`"codeowners"`\]\>\>

##### config

###### Get Signature

```ts
get config(): Required<RootConfig | WorkspaceConfig>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `Required`\<[`RootConfig`](#rootconfig) \| [`WorkspaceConfig`](#workspaceconfig-1)\>

##### dependencies

###### Get Signature

```ts
get dependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `Record`\<`string`, `string`\>

##### description

###### Get Signature

```ts
get description(): undefined | string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `undefined` \| `string`

##### devDependencies

###### Get Signature

```ts
get devDependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `Record`\<`string`, `string`\>

##### isRoot

###### Get Signature

```ts
get isRoot(): boolean;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `boolean`

##### location

###### Get Signature

```ts
get location(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`

##### main

###### Get Signature

```ts
get main(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`

##### name

###### Get Signature

```ts
get name(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`

##### packageJson

###### Get Signature

```ts
get packageJson(): PackageJson;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** [`PackageJson`](#packagejson-1)

##### peerDependencies

###### Get Signature

```ts
get peerDependencies(): Record<string, string>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `Record`\<`string`, `string`\>

##### private

###### Get Signature

```ts
get private(): boolean;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `boolean`

##### publishablePackageJson

###### Get Signature

```ts
get publishablePackageJson(): null | PublicPackageJson;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `null` \| [`PublicPackageJson`](#publicpackagejson)

##### scope

###### Get Signature

```ts
get scope(): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `string`

##### tasks

###### Get Signature

```ts
get tasks(): TaskConfig;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** [`TaskConfig`](#taskconfig-1)

##### version

###### Get Signature

```ts
get version(): undefined | string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Returns:** `undefined` \| `string`

#### Methods

##### getCodeowners()

```ts
getCodeowners(filepath): string[];
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter  | Type     |
| ---------- | -------- |
| `filepath` | `string` |

**Returns:** `string`[]

##### getTasks()

```ts
getTasks(lifecycle): Required<Tasks>;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter   | Type     |
| ----------- | -------- |
| `lifecycle` | `string` |

**Returns:** `Required`\<[`Tasks`](#tasks-2)\>

##### relative()

```ts
relative(to): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `to`      | `string` |

**Returns:** `string`

##### resolve()

```ts
resolve(...pathSegments): string;
```

**Defined in:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)  
**Parameters:**

| Parameter         | Type       |
| ----------------- | ---------- |
| ...`pathSegments` | `string`[] |

**Returns:** `string`

## Interfaces

### PackageManager

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

#### Methods

##### add()

```ts
add(packages, opts?): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter   | Type                     |
| ----------- | ------------------------ |
| `packages`  | `string` \| `string`[]   |
| `opts?`     | \{ `dev?`: `boolean`; \} |
| `opts.dev?` | `boolean`                |

**Returns:** `Promise`\<`void`\>

##### batch()

```ts
batch(processes): Promise<(Error | [string, string])[]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter   | Type                    |
| ----------- | ----------------------- |
| `processes` | [`RunSpec`](#runspec)[] |

**Returns:** `Promise`\<(`Error` \| \[`string`, `string`\])[]\>

##### dedupe()

```ts
dedupe(): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Returns:** `Promise`\<`void`\>

##### info()

```ts
info(name, opts?): Promise<null | NpmInfo>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter | Type                               |
| --------- | ---------------------------------- |
| `name`    | `string`                           |
| `opts?`   | `Partial`\<[`RunSpec`](#runspec)\> |

**Returns:** `Promise`\<`null` \| [`NpmInfo`](#npminfo)\>

##### install()

```ts
install(cwd?): Promise<string>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `cwd?`    | `string` |

**Returns:** `Promise`\<`string`\>

##### loggedIn()

```ts
loggedIn(opts?): Promise<boolean>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter        | Type                                             |
| ---------------- | ------------------------------------------------ |
| `opts?`          | \{ `registry?`: `string`; `scope?`: `string`; \} |
| `opts.registry?` | `string`                                         |
| `opts.scope?`    | `string`                                         |

**Returns:** `Promise`\<`boolean`\>

##### publish()

```ts
publish<T>(opts): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

###### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `T` _extends_ [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter         | Type                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `opts`            | \{ `access?`: `"restricted"` \| `"public"`; `cwd?`: `string`; `otp?`: `string`; `tag?`: `string`; `workspaces`: `T`[]; \} |
| `opts.access?`    | `"restricted"` \| `"public"`                                                                                              |
| `opts.cwd?`       | `string`                                                                                                                  |
| `opts.otp?`       | `string`                                                                                                                  |
| `opts.tag?`       | `string`                                                                                                                  |
| `opts.workspaces` | `T`[]                                                                                                                     |

**Returns:** `Promise`\<`void`\>

##### publishable()

```ts
publishable<T>(workspaces): Promise<T[]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

###### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `T` _extends_ [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter    | Type  |
| ------------ | ----- |
| `workspaces` | `T`[] |

**Returns:** `Promise`\<`T`[]\>

##### remove()

```ts
remove(packages): Promise<void>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter  | Type                   |
| ---------- | ---------------------- |
| `packages` | `string` \| `string`[] |

**Returns:** `Promise`\<`void`\>

##### run()

```ts
run(opts): Promise<[string, string]>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)  
**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `opts`    | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<\[`string`, `string`\]\>

## Type Aliases

### App

```ts
type App = {
	run: () => Promise<void>;
	yargs: Yargs;
};
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)

#### Properties

##### run()

```ts
run: () => Promise<void>;
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)  
**Returns:** `Promise`\<`void`\>

##### yargs

```ts
yargs: Yargs;
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)

---

### Arguments\<CommandArgv\>

```ts
type Arguments<CommandArgv> = { [key in keyof CommandArgv]: CommandArgv[key] } & PositionalArgv;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `CommandArgv`  | `object`     |

---

### Argv\<CommandArgv\>

```ts
type Argv<CommandArgv> = Arguments<CommandArgv & DefaultArgv>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `CommandArgv`  | `object`     |

---

### BasePackageJson

```ts
type BasePackageJson = {
	alias?: string[];
	author?: string | Person;
	bin?: string | Record<string, string>;
	bugs?: {
		email?: string;
		url?: string;
	};
	bundleDependencies?: string[];
	contributors?: (Person | string)[];
	dependencies?: Record<string, string>;
	description?: string;
	devDependencies?: Record<string, string>;
	engines?: Record<string, string>;
	exports?: Record<
		string,
		| string
		| {
				default?: string;
				import?: string;
				require?: string;
				types?: string;
		  }
	>;
	files?: string[];
	homepage?: string;
	keywords?: string[];
	license?: string;
	main?: string;
	name: string;
	optionalDependencies?: string[];
	os?: string[];
	overrides?: Record<string, string>;
	packageManager?: string;
	peerDependencies?: Record<string, string>;
	peerDependenciesMeta?: Record<
		string,
		{
			optional: boolean;
		}
	>;
	scripts?: Record<string, string>;
	version?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Properties

##### alias?

```ts
optional alias: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### author?

```ts
optional author: string | Person;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### bin?

```ts
optional bin: string | Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### bugs?

```ts
optional bugs: {
  email?: string;
  url?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

###### email?

```ts
optional email: string;
```

###### url?

```ts
optional url: string;
```

##### bundleDependencies?

```ts
optional bundleDependencies: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### contributors?

```ts
optional contributors: (Person | string)[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### dependencies?

```ts
optional dependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### description?

```ts
optional description: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### devDependencies?

```ts
optional devDependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### engines?

```ts
optional engines: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### exports?

```ts
optional exports: Record<string,
  | string
  | {
  default?: string;
  import?: string;
  require?: string;
  types?: string;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### files?

```ts
optional files: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### homepage?

```ts
optional homepage: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### keywords?

```ts
optional keywords: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### license?

```ts
optional license: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### main?

```ts
optional main: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### optionalDependencies?

```ts
optional optionalDependencies: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### os?

```ts
optional os: string[];
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### overrides?

```ts
optional overrides: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### packageManager?

```ts
optional packageManager: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### peerDependencies?

```ts
optional peerDependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### peerDependenciesMeta?

```ts
optional peerDependenciesMeta: Record<string, {
  optional: boolean;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### scripts?

```ts
optional scripts: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### version?

```ts
optional version: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### BatchOptions

```ts
type BatchOptions = {
	maxParallel?: number;
};
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

##### maxParallel?

```ts
optional maxParallel: number;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### Builder()\<CommandArgv\>

```ts
type Builder<CommandArgv> = (yargs) => Yargv<CommandArgv>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `CommandArgv`  | `object`     |

**Parameters:**

| Parameter | Type                |
| --------- | ------------------- |
| `yargs`   | [`Yargs`](#yargs-2) |

**Returns:** `Yargv`\<`CommandArgv`\>

---

### Config\<CustomLifecycles\>

```ts
type Config<CustomLifecycles> = RootConfig<CustomLifecycles> | WorkspaceConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/index.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

---

### CorePlugins

```ts
type CorePlugins = Plugin[];
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

---

### DefaultArgv

```ts
type DefaultArgv = {
  dry-run: boolean;
  quiet: boolean;
  skip-engine-check: boolean;
  verbosity: number;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Properties

##### dry-run

```ts
dry-run: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### quiet

```ts
quiet: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### skip-engine-check

```ts
skip-engine-check: boolean;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### verbosity

```ts
verbosity: number;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### DepType

```ts
type DepType = 1 | 2 | 3;
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### GraphSchemaValidators

```ts
type GraphSchemaValidators = Record<string, Record<string,
  | Schema & {
  $required?: boolean;
}
  | (workspace, graph) => Schema & {
  $required?: boolean;
}>>;
```

**Defined in:** [modules/onerepo/src/core/graph/schema.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/schema.ts)

---

### Handler()\<CommandArgv\>

```ts
type Handler<CommandArgv> = (argv, extra) => Promise<void>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `CommandArgv`  | `object`     |

**Parameters:**

| Parameter | Type                             |
| --------- | -------------------------------- |
| `argv`    | [`Argv`](#argv)\<`CommandArgv`\> |
| `extra`   | [`HandlerExtra`](#handlerextra)  |

**Returns:** `Promise`\<`void`\>

---

### HandlerExtra

```ts
type HandlerExtra = {
	config: Required<RootConfig>;
	getAffected: (opts?) => Promise<Workspace[]>;
	getFilepaths: (opts?) => Promise<string[]>;
	getWorkspaces: (opts?) => Promise<Workspace[]>;
	graph: Graph;
	logger: Logger;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Properties

##### config

```ts
config: Required<RootConfig>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### getAffected()

```ts
getAffected: (opts?) => Promise<Workspace[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Parameters:**

| Parameter | Type                                                          |
| --------- | ------------------------------------------------------------- |
| `opts?`   | [`GetterOptions`](onerepo/namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### getFilepaths()

```ts
getFilepaths: (opts?) => Promise<string[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Parameters:**

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `opts?`   | [`FileGetterOptions`](onerepo/namespaces/builders/#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

##### getWorkspaces()

```ts
getWorkspaces: (opts?) => Promise<Workspace[]>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Parameters:**

| Parameter | Type                                                          |
| --------- | ------------------------------------------------------------- |
| `opts?`   | [`GetterOptions`](onerepo/namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### graph

```ts
graph: Graph;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### logger

```ts
logger: Logger;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### Lifecycle

```ts
type Lifecycle =
	| 'pre-commit'
	| 'post-commit'
	| 'post-checkout'
	| 'pre-merge'
	| 'post-merge'
	| 'pre-push'
	| 'build'
	| 'pre-deploy'
	| 'pre-publish'
	| 'post-publish';
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### LoggerOptions

```ts
type LoggerOptions = {
	stream?: Writable;
	verbosity: Verbosity;
};
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Properties

##### stream?

```ts
optional stream: Writable;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### verbosity

```ts
verbosity: Verbosity;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

---

### MinimalWorkspace

```ts
type MinimalWorkspace = {
	location?: string;
	name: string;
	private?: boolean;
	version?: string;
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

#### Properties

##### location?

```ts
optional location: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### private?

```ts
optional private: boolean;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### version?

```ts
optional version: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### NpmInfo

```ts
type NpmInfo = {
  dependencies: Record<string, string>;
  dist-tags: {
   [key: string]: string;
     latest: string;
  };
  homepage: string;
  license: string;
  name: string;
  version: string;
  versions: string[];
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

#### Properties

##### dependencies

```ts
dependencies: Record<string, string>;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### dist-tags

```ts
dist-tags: {
[key: string]: string;
  latest: string;
};
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

###### Index Signature

```ts
[key: string]: string
```

###### latest

```ts
latest: string;
```

##### homepage

```ts
homepage: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### license

```ts
license: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### version

```ts
version: string;
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### versions

```ts
versions: string[];
```

**Defined in:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### PackageJson

```ts
type PackageJson = PrivatePackageJson | PublicPackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### Person

```ts
type Person = {
	email?: string;
	name?: string;
	url?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Properties

##### email?

```ts
optional email: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### name?

```ts
optional name: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### url?

```ts
optional url: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### Plugin

```ts
type Plugin =
  | PluginObject
  | (config, graph) => PluginObject;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

---

### PluginObject

```ts
type PluginObject = {
	shutdown?: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
	startup?: (argv) => Promise<void> | void;
	yargs?: (yargs, visitor) => Yargs;
};
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

#### Properties

##### shutdown()?

```ts
optional shutdown: (argv) =>
  | Promise<Record<string, unknown> | void>
  | Record<string, unknown>
  | void;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)  
**Parameters:**

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `argv`    | [`Argv`](#argv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** \| `Promise`\<`Record`\<`string`, `unknown`\> \| `void`\>
\| `Record`\<`string`, `unknown`\>
\| `void`

##### startup()?

```ts
optional startup: (argv) => Promise<void> | void;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)  
**Parameters:**

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `argv`    | [`Argv`](#argv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`void`\> \| `void`

##### yargs()?

```ts
optional yargs: (yargs, visitor) => Yargs;
```

**Defined in:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)  
**Parameters:**

| Parameter | Type                                                    |
| --------- | ------------------------------------------------------- |
| `yargs`   | [`Yargs`](#yargs-2)                                     |
| `visitor` | `NonNullable`\<`RequireDirectoryOptions`\[`"visit"`\]\> |

**Returns:** [`Yargs`](#yargs-2)

---

### PositionalArgv

```ts
type PositionalArgv = {
  _: (string | number)[];
  --: string[];
  $0: string;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Properties

##### \_

```ts
_: (string | number)[];
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### --

```ts
--: string[];
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

##### $0

```ts
$0: string;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### PrivatePackageJson

```ts
type PrivatePackageJson = {
	license?: 'UNLICENSED';
	private: true;
	workspaces?: string[];
} & BasePackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Type declaration

##### license?

```ts
optional license: "UNLICENSED";
```

##### private

```ts
private: true;
```

##### workspaces?

```ts
optional workspaces: string[];
```

---

### PromiseFn()

```ts
type PromiseFn = () => Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Returns:** `Promise`\<\[`string`, `string`\]\>

---

### PublicPackageJson

```ts
type PublicPackageJson = {
	private?: false;
	publishConfig?: PublishConfig;
	workspaces?: never;
} & BasePackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Type declaration

##### private?

```ts
optional private: false;
```

##### publishConfig?

```ts
optional publishConfig: PublishConfig;
```

##### workspaces?

```ts
optional workspaces: never;
```

---

### PublishConfig

```ts
type PublishConfig = {
	[key: string]: unknown;
	bin?: string | Record<string, string>;
	exports?: Record<
		string,
		| string
		| {
				default?: string;
				import?: string;
				require?: string;
				types?: string;
		  }
	>;
	main?: string;
	module?: string;
	typings?: string;
};
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### bin?

```ts
optional bin: string | Record<string, string>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### exports?

```ts
optional exports: Record<string,
  | string
  | {
  default?: string;
  import?: string;
  require?: string;
  types?: string;
}>;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### main?

```ts
optional main: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### module?

```ts
optional module: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

##### typings?

```ts
optional typings: string;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### RootConfig\<CustomLifecycles\>

```ts
type RootConfig<CustomLifecycles> = {
	changes?: {
		filenames?: 'hash' | 'human';
		formatting?: {
			commit?: string;
			footer?: string;
		};
		prompts?: 'guided' | 'semver';
	};
	codeowners?: Record<string, string[]>;
	commands?: {
		directory?: string | false;
		ignore?: RegExp;
	};
	dependencies?: {
		dedupe?: boolean;
		mode?: 'strict' | 'loose' | 'off';
	};
	head?: string;
	ignore?: string[];
	meta?: Record<string, unknown>;
	plugins?: Plugin[];
	root: true;
	taskConfig?: {
		lifecycles?: CustomLifecycles[];
		stashUnstaged?: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
	};
	tasks?: TaskConfig<CustomLifecycles>;
	templateDir?: string;
	validation?: {
		schema?: string | null;
	};
	vcs?: {
		autoSyncHooks?: boolean;
		hooksPath?: string;
		provider?: 'github' | 'gitlab' | 'bitbucket' | 'gitea';
	};
	visualizationUrl?: string;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

#### Properties

##### changes?

```ts
optional changes: {
  filenames?: "hash" | "human";
  formatting?: {
     commit?: string;
     footer?: string;
  };
  prompts?: "guided" | "semver";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### filenames?

```ts
optional filenames: "hash" | "human";
```

###### formatting?

```ts
optional formatting: {
  commit?: string;
  footer?: string;
};
```

###### formatting.commit?

```ts
optional commit: string;
```

###### formatting.footer?

```ts
optional footer: string;
```

###### prompts?

```ts
optional prompts: "guided" | "semver";
```

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### commands?

```ts
optional commands: {
  directory?: string | false;
  ignore?: RegExp;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### directory?

```ts
optional directory: string | false;
```

###### ignore?

```ts
optional ignore: RegExp;
```

##### dependencies?

```ts
optional dependencies: {
  dedupe?: boolean;
  mode?: "strict" | "loose" | "off";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### dedupe?

```ts
optional dedupe: boolean;
```

###### mode?

```ts
optional mode: "strict" | "loose" | "off";
```

##### head?

```ts
optional head: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### ignore?

```ts
optional ignore: string[];
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### plugins?

```ts
optional plugins: Plugin[];
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### root

```ts
root: true;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### taskConfig?

```ts
optional taskConfig: {
  lifecycles?: CustomLifecycles[];
  stashUnstaged?: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### lifecycles?

```ts
optional lifecycles: CustomLifecycles[];
```

###### stashUnstaged?

```ts
optional stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
```

##### tasks?

```ts
optional tasks: TaskConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### templateDir?

```ts
optional templateDir: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

##### validation?

```ts
optional validation: {
  schema?: string | null;
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### schema?

```ts
optional schema: string | null;
```

##### vcs?

```ts
optional vcs: {
  autoSyncHooks?: boolean;
  hooksPath?: string;
  provider?: "github" | "gitlab" | "bitbucket" | "gitea";
};
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

###### autoSyncHooks?

```ts
optional autoSyncHooks: boolean;
```

###### hooksPath?

```ts
optional hooksPath: string;
```

###### provider?

```ts
optional provider: "github" | "gitlab" | "bitbucket" | "gitea";
```

##### visualizationUrl?

```ts
optional visualizationUrl: string;
```

**Defined in:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

---

### RunSpec

```ts
type RunSpec = {
	args?: string[];
	cmd: string;
	name: string;
	opts?: SpawnOptions;
	runDry?: boolean;
	skipFailures?: boolean;
	step?: LogStep;
};
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

##### args?

```ts
optional args: string[];
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### cmd

```ts
cmd: string;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### name

```ts
name: string;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### opts?

```ts
optional opts: SpawnOptions;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### runDry?

```ts
optional runDry: boolean;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### skipFailures?

```ts
optional skipFailures: boolean;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### Serialized

```ts
type Serialized = {
	links: {
		source: string;
		target: string;
		weight: DepType;
	}[];
	nodes: {
		id: string;
	}[];
};
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Properties

##### links

```ts
links: {
	source: string;
	target: string;
	weight: DepType;
}
[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

###### source

```ts
source: string;
```

###### target

```ts
target: string;
```

###### weight

```ts
weight: DepType;
```

##### nodes

```ts
nodes: {
	id: string;
}
[];
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

###### id

```ts
id: string;
```

---

### Task

```ts
type Task = string | TaskDef | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### TaskConfig\<CustomLifecycles\>

```ts
type TaskConfig<CustomLifecycles> = Partial<
	Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>
>;
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

---

### TaskDef

```ts
type TaskDef = {
	cmd: string | string[];
	match?: string | string[];
	meta?: Record<string, unknown>;
};
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

#### Properties

##### cmd

```ts
cmd: string | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

##### match?

```ts
optional match: string | string[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### Tasks

```ts
type Tasks = {
	parallel?: Task[];
	serial?: Task[];
};
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

#### Properties

##### parallel?

```ts
optional parallel: Task[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

##### serial?

```ts
optional serial: Task[];
```

**Defined in:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### Verbosity

```ts
type Verbosity = 0 | 1 | 2 | 3 | 4 | 5;
```

**Defined in:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

---

### WorkspaceConfig\<CustomLifecycles\>

```ts
type WorkspaceConfig<CustomLifecycles> = {
	codeowners?: Record<string, string[]>;
	commands?: {
		passthrough: Record<
			string,
			{
				command?: string;
				description: string;
			}
		>;
	};
	meta?: Record<string, unknown>;
	tasks?: TaskConfig<CustomLifecycles>;
};
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

#### Type Parameters

| Type Parameter                                  | Default type |
| ----------------------------------------------- | ------------ |
| `CustomLifecycles` _extends_ `string` \| `void` | `void`       |

#### Properties

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

##### commands?

```ts
optional commands: {
  passthrough: Record<string, {
     command?: string;
     description: string;
  }>;
};
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

###### passthrough

```ts
passthrough: Record<
	string,
	{
		command?: string;
		description: string;
	}
>;
```

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

##### tasks?

```ts
optional tasks: TaskConfig<CustomLifecycles>;
```

**Defined in:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

---

### Yargs\<CommandArgv\>

```ts
type Yargs<CommandArgv> = Yargv<CommandArgv>;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type Parameters

| Type Parameter | Default type                  |
| -------------- | ----------------------------- |
| `CommandArgv`  | [`DefaultArgv`](#defaultargv) |

## Variables

### commandDirOptions()

```ts
const commandDirOptions: ({ exclude, graph, startup, config, logger }) => RequireDirectoryOptions & {
	visit: NonNullable<RequireDirectoryOptions['visit']>;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Parameters:**

| Parameter                                      | Type             |
| ---------------------------------------------- | ---------------- |
| `{ exclude, graph, startup, config, logger, }` | `CommandDirOpts` |

**Returns:** `RequireDirectoryOptions` & \{
`visit`: `NonNullable`\<`RequireDirectoryOptions`\[`"visit"`\]\>;
\}

---

### corePlugins

```ts
const corePlugins: CorePlugins;
```

**Defined in:** [modules/onerepo/src/setup/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/index.ts)

---

### defaultConfig

```ts
const defaultConfig: Required<RootConfig>;
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)

---

### DependencyType

```ts
const DependencyType: {
	DEV: 2;
	PEER: 1;
	PROD: 3;
};
```

**Defined in:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Type declaration

##### DEV

```ts
readonly DEV: 2;
```

##### PEER

```ts
readonly PEER: 1;
```

##### PROD

```ts
readonly PROD: 3;
```

---

### noRepoPlugins

```ts
const noRepoPlugins: CorePlugins;
```

**Defined in:** [modules/onerepo/src/setup/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/index.ts)

---

### parserConfiguration

```ts
const parserConfiguration: {
  camel-case-expansion: boolean;
  greedy-arrays: boolean;
  populate--: boolean;
  sort-commands: boolean;
  strip-aliased: boolean;
};
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

#### Type declaration

##### camel-case-expansion

```ts
camel-case-expansion: boolean;
```

##### greedy-arrays

```ts
greedy-arrays: boolean;
```

##### populate--

```ts
populate--: boolean;
```

##### sort-commands

```ts
sort-commands: boolean;
```

##### strip-aliased

```ts
strip-aliased: boolean;
```

## Functions

### batch()

```ts
function batch(processes, options?): Promise<(Error | [string, string])[]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter   | Type                                                   |
| ----------- | ------------------------------------------------------ |
| `processes` | ([`RunSpec`](#runspec) \| [`PromiseFn`](#promisefn))[] |
| `options?`  | [`BatchOptions`](#batchoptions)                        |

**Returns:** `Promise`\<(`Error` \| \[`string`, `string`\])[]\>

---

### bufferSubLogger()

```ts
function bufferSubLogger(step): {
	end: () => Promise<void>;
	logger: Logger;
};
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)  
**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `step`    | [`LogStep`](#logstep) |

**Returns:** ```ts
{
end: () => Promise<void>;
logger: Logger;
}

````

##### end()

```ts
end: () => Promise<void>;
````

**Returns:** `Promise`\<`void`\>

##### logger

```ts
logger: Logger;
```

---

### destroyLogger()

```ts
function destroyLogger(): void;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)  
**Returns:** `void`

---

### getGraph()

```ts
function getGraph(workingDir?): Promise<Graph>;
```

**Defined in:** [modules/graph/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts)  
**Parameters:**

| Parameter     | Type     |
| ------------- | -------- |
| `workingDir?` | `string` |

**Returns:** `Promise`\<[`Graph`](#graph)\>

---

### getLockfile()

```ts
function getLockfile(cwd): null | string;
```

**Defined in:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)  
**Parameters:**

| Parameter | Type     |
| --------- | -------- |
| `cwd`     | `string` |

**Returns:** `null` \| `string`

---

### getLogger()

```ts
function getLogger(opts?): Logger;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)  
**Parameters:**

| Parameter | Type                                           |
| --------- | ---------------------------------------------- |
| `opts?`   | `Partial`\<[`LoggerOptions`](#loggeroptions)\> |

**Returns:** [`Logger`](#logger)

---

### getPackageManager()

```ts
function getPackageManager(type): PackageManager;
```

**Defined in:** [modules/package-manager/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/index.ts)  
**Parameters:**

| Parameter | Type                            |
| --------- | ------------------------------- |
| `type`    | `"pnpm"` \| `"npm"` \| `"yarn"` |

**Returns:** [`PackageManager`](#packagemanager-1)

---

### getPackageManagerName()

```ts
function getPackageManagerName(cwd, fromPkgJson?): 'pnpm' | 'npm' | 'yarn';
```

**Defined in:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)  
**Parameters:**

| Parameter      | Type     |
| -------------- | -------- |
| `cwd`          | `string` |
| `fromPkgJson?` | `string` |

**Returns:** `"pnpm"` \| `"npm"` \| `"yarn"`

---

### getPublishablePackageJson()

```ts
function getPublishablePackageJson(input): PublicPackageJson;
```

**Defined in:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)  
**Parameters:**

| Parameter | Type                                      |
| --------- | ----------------------------------------- |
| `input`   | [`PublicPackageJson`](#publicpackagejson) |

**Returns:** [`PublicPackageJson`](#publicpackagejson)

---

### getRootPackageJson()

```ts
function getRootPackageJson(searchLocation): {
	filePath: string;
	json: PackageJson;
};
```

**Defined in:** [modules/graph/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts)  
**Parameters:**

| Parameter        | Type     |
| ---------------- | -------- |
| `searchLocation` | `string` |

**Returns:** ```ts
{
filePath: string;
json: PackageJson;
}

````

##### filePath

```ts
filePath: string;
````

##### json

```ts
json: PackageJson;
```

---

### internalSetup()

```ts
function internalSetup(__namedParameters): Promise<App>;
```

**Defined in:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)  
**Parameters:**

| Parameter                       | Type                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__namedParameters`             | \{ `config`: [`Config`](#config-1); `corePlugins`: [`CorePlugins`](#coreplugins-1); `graph?`: [`Graph`](#graph); `logger?`: [`Logger`](#logger); `require?`: `Require`; `root`: `string`; `yargs`: `Argv`; \} |
| `__namedParameters.config`      | [`Config`](#config-1)                                                                                                                                                                                         |
| `__namedParameters.corePlugins` | [`CorePlugins`](#coreplugins-1)                                                                                                                                                                               |
| `__namedParameters.graph?`      | [`Graph`](#graph)                                                                                                                                                                                             |
| `__namedParameters.logger?`     | [`Logger`](#logger)                                                                                                                                                                                           |
| `__namedParameters.require?`    | `Require`                                                                                                                                                                                                     |
| `__namedParameters.root`        | `string`                                                                                                                                                                                                      |
| `__namedParameters.yargs`       | `Argv`                                                                                                                                                                                                        |

**Returns:** `Promise`\<[`App`](#app)\>

---

### run()

```ts
function run(options): Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `options` | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<\[`string`, `string`\]\>

---

### runTasks()

```ts
function runTasks(lifecycle, args, graph, logger?): Promise<void>;
```

**Defined in:** [modules/onerepo/src/core/tasks/run-tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/tasks/run-tasks.ts)  
**Parameters:**

| Parameter   | Type                      |
| ----------- | ------------------------- |
| `lifecycle` | [`Lifecycle`](#lifecycle) |
| `args`      | `string`[]                |
| `graph`     | [`Graph`](#graph)         |
| `logger?`   | [`Logger`](#logger)       |

**Returns:** `Promise`\<`void`\>

---

### setup()

```ts
function setup(root, config): Promise<App>;
```

**Defined in:** [modules/onerepo/src/setup/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/index.ts)  
**Parameters:**

| Parameter | Type                  |
| --------- | --------------------- |
| `root`    | `string`              |
| `config`  | [`Config`](#config-1) |

**Returns:** `Promise`\<[`App`](#app)\>

---

### setupYargs()

```ts
function setupYargs(yargs, __namedParameters): Yargs;
```

**Defined in:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)  
**Parameters:**

| Parameter                  | Type                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `yargs`                    | `Argv`                                                            |
| `__namedParameters`        | \{ `graph?`: [`Graph`](#graph); `logger`: [`Logger`](#logger); \} |
| `__namedParameters.graph?` | [`Graph`](#graph)                                                 |
| `__namedParameters.logger` | [`Logger`](#logger)                                               |

**Returns:** [`Yargs`](#yargs-2)

---

### start()

```ts
function start(options): ChildProcess;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter | Type                                                    |
| --------- | ------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"runDry"` \| `"name"`\> |

**Returns:** `ChildProcess`

---

### stepWrapper()

```ts
function stepWrapper<T>(options, fn): Promise<T>;
```

**Defined in:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter       | Type                                                    |
| --------------- | ------------------------------------------------------- |
| `options`       | \{ `name`: `string`; `step?`: [`LogStep`](#logstep); \} |
| `options.name`  | `string`                                                |
| `options.step?` | [`LogStep`](#logstep)                                   |
| `fn`            | (`step`) => `Promise`\<`T`\>                            |

**Returns:** `Promise`\<`T`\>

---

### sudo()

```ts
function sudo(options): Promise<[string, string]>;
```

**Defined in:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)  
**Parameters:**

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"opts"`\> & \{ `reason?`: `string`; \} |

**Returns:** `Promise`\<\[`string`, `string`\]\>

<!-- end-onerepo-sentinel -->
