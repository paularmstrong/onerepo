---
title: 'oneRepo API: builders'
sidebar:
  label: builders
---

:::note
Note that while `builders` are available from the namespace import, the “getters” should typically be referenced from the extra arguments passed to your `handler` function:
:::

```ts ins="getWorkspaces" ins="builders"
import { builders } from 'onerepo';

export const name = 'mycommand';

export const builder: Builder = (yargs) => builders.withWorkspaces(yargs);

export const handler: Handler = async (argv, { getWorkspaces, logger }) => {
	const workspaces = await getWorkspaces();

	logger.log(workspaces.map(({ name }) => name));
};
```

```sh
$ one mycommand --workspaces ws-1 ws-2
['ws-1', 'ws-2']
```

<!--

DO NOT EDIT BELOW THIS LINE.
All content is auto-generated using a oneRepo command:

  $ one docs typedoc

-->

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<c81848f28daa37273d49f35ec5b6dd7d>> -->

Common and reusable command-line option builders.

## Type Aliases

### FileGetterOptions

```ts
type FileGetterOptions: GetterOptions & {
  affectedThreshold: number;
};
```

#### Type declaration

##### affectedThreshold?

```ts
optional affectedThreshold: number;
```

Threshold of number of files until we fall-back and swap to Workspace locations. This exists as a safeguard from attempting to pass too many files through to subprocesses and hitting the limit on input argv, resulting in unexpected and unexplainable errors.

###### Default Value

```ts
100;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### Staged

```ts
type Staged: {
  from: never;
  staged: true;
  through: never;
};
```

#### Type declaration

##### from?

```ts
optional from: never;
```

##### staged

```ts
staged: true;
```

Limit to only changes that are currently staged. This cannot be used with `from` and `through`.

##### through?

```ts
optional through: never;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### Through

```ts
type Through: {
  from: string;
  staged: false;
  through: string;
};
```

#### Type declaration

##### from?

```ts
optional from: string;
```

Git ref to calculate changes _exclusively_ _since_.

##### staged?

```ts
optional staged: false;
```

##### through?

```ts
optional through: string;
```

Git ref to calculate changes _inclusively_ _through_.

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

## Builders

### withAffected()

```ts
function withAffected<T>(yargs): Yargs<T & WithAffected>;
```

Adds the following input arguments to command [\`Handler\`](../../#handlercommandargv). Typically used in conjunction with getters like [\`builders.getAffected\`](#getaffected), [\`builders.getFilepaths\`](#getfilepaths), and [\`builders.getGetWorkspaces\`](#getworkspaces).

- `--affected`
- `--from-ref`
- `--through-ref`

If all of `--all`, `--files`, and `--workspaces` were not passed, `--affected` will default to `true`.

See [`WithAffected`](#withaffected-1) for type safety.

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withAffected(yargs);
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type           |
| --------- | -------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithAffected`](#withaffected-1)\>  
**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

---

### withAllInputs()

```ts
function withAllInputs(yargs): Yargs<WithAllInputs>;
```

Helper to chain all of [\`builders.withAffected\`](#withaffected), [\`builders.withFiles\`](#withfiles), and [\`builders.withWorkspaces\`](#withworkspaces) on a [\`Builder\`](../../#buildercommandargv).

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withAllInputs(yargs);
```

**Parameters:**

| Parameter | Type                                           |
| --------- | ---------------------------------------------- |
| `yargs`   | `Yargs`\<[`DefaultArgv`](../../#defaultargv)\> |

**Returns:** `Yargs`\<[`WithAllInputs`](#withallinputs-1)\>  
**Defined in:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts)

---

### withFiles()

```ts
function withFiles<T>(yargs): Yargs<T & WithFiles>;
```

Adds the following input arguments to command [\`Handler\`](../../#handlercommandargv). Typically used in conjunction with getters like [\`builders.getFilepaths\`](#getfilepaths).

- `--files`

See [`WithFiles`](#withfiles-1) for type safety.

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withFiles(yargs);
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type           |
| --------- | -------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithFiles`](#withfiles-1)\>  
**Defined in:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts)

---

### withWorkspaces()

```ts
function withWorkspaces<T>(yargs): Yargs<T & WithWorkspaces>;
```

Adds the following input arguments to command [\`Handler\`](../../#handlercommandargv). Typically used in conjunction with getters like [\`builders.getAffected\`](#getaffected) [\`builders.getWorkspaces\`](#getworkspaces).

- `--all`
- `--workspaces`

See [\`builders.WithWorkspaces\`](#withworkspaces-1) for type safety.

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withWorkspaces(yargs);
```

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type           |
| --------- | -------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithWorkspaces`](#withworkspaces-1)\>  
**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

---

### WithAffected

```ts
type WithAffected: {
  affected: boolean;
  from-ref: string;
  staged: boolean;
  through-ref: string;
};
```

To be paired with the [\`builders.withAffected\`](#withaffected). Adds types for arguments parsed.

```ts title="commands/mycommand.ts"
type Argv = builders.WithAffected & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withAffected(yargs);
```

#### Type declaration

##### affected?

```ts
optional affected: boolean;
```

When used with builder helpers, will include all of the affected Workspaces based on changes within the repository.

##### from-ref?

```ts
optional from-ref: string;
```

Git ref to calculate changes _exclusively_ _since_.

##### staged?

```ts
optional staged: boolean;
```

Calculate changes based _inclusively_ on the files added to the git stage.

##### through-ref?

```ts
optional through-ref: string;
```

Git ref to calculate changes _inclusively_ _through_.

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

---

### WithAllInputs

```ts
type WithAllInputs: WithAffected & WithFiles & WithWorkspaces;
```

Helper to include all of [\`builders.withAffected\`](#withaffected), [\`builders.withFiles\`](#withfiles), and [\`builders.withWorkspaces\`](#withworkspaces) on builder [\`Argv\`](../../#argvcommandargv).

```ts title="commands/mycommand.ts"
type Argv = builders.WithAllInputs & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withAllInputs(yargs);
```

**Defined in:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts)

---

### WithFiles

```ts
type WithFiles: {
  files: string[];
};
```

To be paired with the [\`builders.withFiles\`](#withfiles). Adds types for arguments parsed.

```ts title="commands/mycommand.ts"
type Argv = builders.WithFiles & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withFiles(yargs);
```

#### Type declaration

##### files?

```ts
optional files: string[];
```

List of filepaths.

**Defined in:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts)

---

### WithWorkspaces

```ts
type WithWorkspaces: {
  all: boolean;
  workspaces: string[];
};
```

To be paired with the [\`builders.withWorkspaces\`](#withworkspaces). Adds types for arguments parsed.

```ts title="commands/mycommand.ts"
type Argv = builders.WithWorkspaces & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withWorkspaces(yargs);
```

#### Type declaration

##### all?

```ts
optional all: boolean;
```

Include _all_ Workspaces.

##### workspaces?

```ts
optional workspaces: string[];
```

One or more Workspaces by `name` or `alias` string.

**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

## Getters

### getAffected()

```ts
function getAffected(graph, __namedParameters?): Promise<Workspace[]>;
```

Get a list of the affected Workspaces.

Typically, this should be used from the helpers provided by the command [\`Handler\`](../../#handlercommandargv), in which case the first argument has been scoped for you already.

If the root Workspace is included in the list, all Workspaces will be presumed affected and returned.

```ts
export const handler: Handler = (argv, { getAffected, logger }) => {
	const workspaces = await getAffected();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

**Parameters:**

| Parameter            | Type                              |
| -------------------- | --------------------------------- |
| `graph`              | [`Graph`](../../#graph)           |
| `__namedParameters`? | [`GetterOptions`](#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](../../#workspace)[]\>  
**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### getFilepaths()

```ts
function getFilepaths(graph, argv, __namedParameters?): Promise<string[]>;
```

Get a list of filepaths based on the input arguments made available with the builders [\`builders.withAffected\`](#withaffected), [\`builders.withAllInputs\`](#withallinputs), [\`builders.withFiles\`](#withfiles), and [\`builders.withWorkspaces\`](#withworkspaces).

When providing `--workspaces <names>`, the paths will be paths to the requested Workspaces, not individual files.

Typically, this should be used from the helpers provided by the command handler’s [\`HandlerExtra\`](../../#handlerextra), in which case the first argument has been scoped for you already.

When using this function to get affected filenames, a soft threshold is provided at 100 files. This is a safeguard against overloading [subprocess \`run\`](../../#run-1) arguments. When the threshold is hit, this function will swap to return the set of parent Workspace locations for the affected file lists.

```ts
export const handler: Handler = (argv, { getFilepaths, logger }) => {
	const filepaths = await getFilepaths();
	for (const files of filepaths) {
		logger.log(files);
	}
};
```

**Parameters:**

| Parameter            | Type                                      |
| -------------------- | ----------------------------------------- |
| `graph`              | [`Graph`](../../#graph)                   |
| `argv`               | [`WithAllInputs`](#withallinputs-1)       |
| `__namedParameters`? | [`FileGetterOptions`](#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>  
**See also:**
!HandlerExtra

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### getWorkspaces()

```ts
function getWorkspaces(graph, argv, __namedParameters?): Promise<Workspace[]>;
```

Get a list of Workspaces based on the input arguments made available with the builders [\`builders.withAffected\`](#withaffected), [\`builders.withAllInputs\`](#withallinputs), [\`builders.withFiles\`](#withfiles), and [\`builders.withWorkspaces\`](#withworkspaces).

Typically, this should be used from the helpers provided by the command [\`Handler\`](../../#handlercommandargv), in which case the first argument has been scoped for you already.

If the root Workspace is included in the list, all Workspaces will be presumed affected and returned.

```ts
export const handler: Handler = (argv, { getWorkspaces, logger }) => {
	const workspaces = await getWorkspaces();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

**Parameters:**

| Parameter            | Type                                |
| -------------------- | ----------------------------------- |
| `graph`              | [`Graph`](../../#graph)             |
| `argv`               | [`WithAllInputs`](#withallinputs-1) |
| `__namedParameters`? | [`GetterOptions`](#getteroptions)   |

**Returns:** `Promise`\<[`Workspace`](../../#workspace)[]\>  
**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### Argv

```ts
type Argv: WithAllInputs;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### GetterOptions

```ts
type GetterOptions: Through | Staged & {
  ignore: string[];
  step: LogStep;
};
```

#### Type declaration

##### ignore?

```ts
optional ignore: string[];
```

List of files to not take into account when getting the list of files, workspaces, and affected.

##### step?

```ts
optional step: LogStep;
```

Optional logger step to avoid creating a new

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

<!-- end-onerepo-sentinel -->
