---
title: 'oneRepo API: builders'
sidebar:
  label: builders
---

<!--

DO NOT EDIT BELOW THIS LINE.
All content is auto-generated using a oneRepo command:

  $ one docs typedoc

-->

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<8d41d38f9203041871fb20eae1439fb4>> -->

Builders and Getters work together as reusable ways to add optional command-line arguments that affect how workspaces and files are retrived.

Note that while `builders` are available, the “getters” should typically be referenced from the extra arguments passed to your `handler` function:

```ts
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
affectedThreshold?: number;
```

Threshold of number of files until we fall-back and swap to workspace locations. This exists as a safeguard from attempting to pass too many files through to subprocesses and hitting the limit on input argv, resulting in unexpected and unexplainable errors.

###### Default Value

```ts
100;
```

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L78)

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
from?: never;
```

##### staged

```ts
staged: true;
```

Limit to only changes that are currently staged. This cannot be used with `from` and `through`.

##### through?

```ts
through?: never;
```

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L15)

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
from?: string;
```

Git ref to calculate changes _exclusively_ _since_.

##### staged?

```ts
staged?: false;
```

##### through?

```ts
through?: string;
```

Git ref to calculate changes _inclusively_ _through_.

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L4)

## Builder

### withAffected()

```ts
withAffected<T>(yargs): Yargs<T & WithAffected>
```

Adds the following input arguments to command [`Handler`](../../#handlercommandargv). Typically used in conjunction with getters like [`builders.getAffected`](#getaffected), [`builders.getFilepaths`](#getfilepaths), and [`builders.getGetWorkspaces`](#getworkspaces).

- `--affected`
- `--from-ref`
- `--through-ref`

If all of `--all`, `--files`, and `--workspaces` were not passed, `--affected` will default to `true`.

See [`WithAffected`](#withaffected-1) for type safety.

#### Type parameters

| Type parameter |
| :------------- |
| `T`            |

#### Parameters

| Parameter | Type           |
| :-------- | :------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithAffected`](#withaffected-1)\>

#### Example

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withAffected(yargs);
```

**Source:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts#L19)

---

### withAllInputs()

```ts
withAllInputs(yargs): Yargs<WithAllInputs>
```

Helper to chain all of [`builders.withAffected`](#withaffected), [`builders.withFiles`](#withfiles), and [`builders.withWorkspaces`](#withworkspaces) on a [`Builder`](../../#buildercommandargv).

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withAllInputs(yargs);
```

#### Parameters

| Parameter | Type                                           |
| :-------- | :--------------------------------------------- |
| `yargs`   | `Yargs`\<[`DefaultArgv`](../../#defaultargv)\> |

**Returns:** `Yargs`\<[`WithAllInputs`](#withallinputs-1)\>

**Source:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts#L14)

---

### withFiles()

```ts
withFiles<T>(yargs): Yargs<T & WithFiles>
```

Adds the following input arguments to command [`Handler`](../../#handlercommandargv). Typically used in conjunction with getters like [`builders.getFilepaths`](#getfilepaths).

- `--files`

See [`WithFiles`](#withfiles-1) for type safety.

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withFiles(yargs);
```

#### Type parameters

| Type parameter |
| :------------- |
| `T`            |

#### Parameters

| Parameter | Type           |
| :-------- | :------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithFiles`](#withfiles-1)\>

**Source:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts#L14)

---

### withWorkspaces()

```ts
withWorkspaces<T>(yargs): Yargs<T & WithWorkspaces>
```

Adds the following input arguments to command [`Handler`](../../#handlercommandargv). Typically used in conjunction with getters like [`builders.getAffected`](#getaffected) [`builders.getWorkspaces`](#getworkspaces).

- `--all`
- `--workspaces`

See [`builders.WithWorkspaces`](#withworkspaces-1) for type safety.

```js title="commands/mycommand.js"
export const builder = (yargs) => builders.withWorkspaces(yargs);
```

#### Type parameters

| Type parameter |
| :------------- |
| `T`            |

#### Parameters

| Parameter | Type           |
| :-------- | :------------- |
| `yargs`   | `Yargs`\<`T`\> |

**Returns:** `Yargs`\<`T` & [`WithWorkspaces`](#withworkspaces-1)\>

**Source:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts#L15)

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

To be paired with the [`builders.withAffected`](#withaffected). Adds types for arguments parsed.

#### Example

```ts title="commands/mycommand.ts"
type Argv = builders.WithAffected & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withAffected(yargs);
```

#### Type declaration

##### affected?

```ts
affected?: boolean;
```

When used with builder helpers, will include all of the affected workspaces based on changes within the repository.

##### from-ref?

```ts
from-ref?: string;
```

Git ref to calculate changes _exclusively_ _since_.

##### staged?

```ts
staged?: boolean;
```

Calculate changes based _inclusively_ on the files added to the git stage.

##### through-ref?

```ts
through-ref?: string;
```

Git ref to calculate changes _inclusively_ _through_.

**Source:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts#L34)

---

### WithAllInputs

```ts
type WithAllInputs: WithAffected & WithFiles & WithWorkspaces;
```

Helper to include all of [`builders.withAffected`](#withaffected), [`builders.withFiles`](#withfiles), and [`builders.withWorkspaces`](#withworkspaces) on builder [`Argv`](../../#argvcommandargv).

```ts title="commands/mycommand.ts"
type Argv = builders.WithAllInputs & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withAllInputs(yargs);
```

**Source:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts#L28)

---

### WithFiles

```ts
type WithFiles: {
  files: string[];
};
```

To be paired with the [`builders.withFiles`](#withfiles). Adds types for arguments parsed.

```ts title="commands/mycommand.ts"
type Argv = builders.WithFiles & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withFiles(yargs);
```

#### Type declaration

##### files?

```ts
files?: string[];
```

List of filepaths.

**Source:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts#L28)

---

### WithWorkspaces

```ts
type WithWorkspaces: {
  all: boolean;
  workspaces: string[];
};
```

To be paired with the [`builders.withWorkspaces`](#withworkspaces). Adds types for arguments parsed.

```ts title="commands/mycommand.ts"
type Argv = builders.WithWorkspaces & {
	// ...
};

export const builder: Builder<Argv> = (yargs) => builders.withWorkspaces(yargs);
```

#### Type declaration

##### all?

```ts
all?: boolean;
```

Include _all_ workspaces.

##### workspaces?

```ts
workspaces?: string[];
```

One or more workspaces by `name` or `alias` string.

**Source:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts#L29)

## Getter

### getAffected()

```ts
getAffected(graph, __namedParameters?): Promise<Workspace[]>
```

Get a list of the affected workspaces.

Typically, this should be used from the helpers provided by the command [`Handler`](../../#handlercommandargv), in which case the first argument has been scoped for you already.

If the root workspace is included in the list, all workspaces will be presumed affected and returned.

```ts
export const handler: Handler = (argv, { getAffected, logger }) => {
	const workspaces = await getAffected();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

#### Parameters

| Parameter            | Type                              |
| :------------------- | :-------------------------------- |
| `graph`              | [`Graph`](#graph)                 |
| `__namedParameters`? | [`GetterOptions`](#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L58)

---

### getFilepaths()

```ts
getFilepaths(
   graph,
   argv,
__namedParameters?): Promise<string[]>
```

Get a list of filepaths based on the input arguments made available with the builders [`builders.withAffected`](#withaffected), [`builders.withAllInputs`](#withallinputs), [`builders.withFiles`](#withfiles), and [`builders.withWorkspaces`](#withworkspaces).

When providing `--workspaces <names>`, the paths will be paths to the requested workspaces, not individual files.

Typically, this should be used from the helpers provided by the command handler’s [`HandlerExtra`](../../#handlerextra), in which case the first argument has been scoped for you already.

When using this function to get affected filenames, a soft threshold is provided at 100 files. This is a safeguard against overloading [subprocess `run`](../../#run-1) arguments. When the threshold is hit, this function will swap to return the set of parent workspace locations for the affected file lists.

#### Parameters

| Parameter            | Type                                      |
| :------------------- | :---------------------------------------- |
| `graph`              | [`Graph`](#graph)                         |
| `argv`               | [`WithAllInputs`](#withallinputs-1)       |
| `__namedParameters`? | [`FileGetterOptions`](#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

#### Example

```ts
export const handler: Handler = (argv, { getFilepaths, logger }) => {
	const filepaths = await getFilepaths();
	for (const files of filepaths) {
		logger.log(files);
	}
};
```

#### See

!HandlerExtra

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L108)

---

### getWorkspaces()

```ts
getWorkspaces(
   graph,
   argv,
__namedParameters?): Promise<Workspace[]>
```

Get a list of workspaces based on the input arguments made available with the builders [`builders.withAffected`](#withaffected), [`builders.withAllInputs`](#withallinputs), [`builders.withFiles`](#withfiles), and [`builders.withWorkspaces`](#withworkspaces).

Typically, this should be used from the helpers provided by the command [`Handler`](../../#handlercommandargv), in which case the first argument has been scoped for you already.

If the root workspace is included in the list, all workspaces will be presumed affected and returned.

```ts
export const handler: Handler = (argv, { getWorkspaces, logger }) => {
	const workspaces = await getWorkspaces();
	for (const ws of workspaces) {
		logger.log(ws.name);
	}
};
```

#### Parameters

| Parameter            | Type                                |
| :------------------- | :---------------------------------- |
| `graph`              | [`Graph`](#graph)                   |
| `argv`               | [`WithAllInputs`](#withallinputs-1) |
| `__namedParameters`? | [`GetterOptions`](#getteroptions)   |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L77)

---

### Argv

```ts
type Argv: WithAllInputs;
```

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L39)

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
ignore?: string[];
```

List of files to not take into account when getting the list of files, workspaces, and affected.

##### step?

```ts
step?: LogStep;
```

Optional logger step to avoid creating a new

**Source:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts#L26)

<!-- end-onerepo-sentinel -->
