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
<!-- @generated SignedSource<<71441b93216c08fe26afcb981b7bbfc4>> -->

## Type Aliases

### Argv

```ts
type Argv = WithAllInputs;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### FileGetterOptions

```ts
type FileGetterOptions = GetterOptions & {
	affectedThreshold?: number;
};
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

#### Type declaration

##### affectedThreshold?

```ts
optional affectedThreshold: number;
```

---

### GetterOptions

```ts
type GetterOptions =
	| Through
	| (Staged & {
			ignore?: string[];
			step?: LogStep;
	  });
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

#### Type declaration

##### ignore?

```ts
optional ignore: string[];
```

##### step?

```ts
optional step: LogStep;
```

---

### Staged

```ts
type Staged = {
	from?: never;
	staged: true;
	through?: never;
};
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

#### Properties

##### from?

```ts
optional from: never;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

##### staged

```ts
staged: true;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

##### through?

```ts
optional through: never;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### Through

```ts
type Through = {
	from?: string;
	staged?: false;
	through?: string;
};
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

#### Properties

##### from?

```ts
optional from: string;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

##### staged?

```ts
optional staged: false;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

##### through?

```ts
optional through: string;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)

---

### WithAffected

```ts
type WithAffected = {
  affected?: boolean;
  from-ref?: string;
  staged?: boolean;
  through-ref?: string;
};
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

#### Properties

##### affected?

```ts
optional affected: boolean;
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

##### from-ref?

```ts
optional from-ref: string;
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

##### staged?

```ts
optional staged: boolean;
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

##### through-ref?

```ts
optional through-ref: string;
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

---

### WithAllInputs

```ts
type WithAllInputs = WithAffected & WithFiles & WithWorkspaces;
```

**Defined in:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts)

---

### WithFiles

```ts
type WithFiles = {
	files?: string[];
};
```

**Defined in:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts)

#### Properties

##### files?

```ts
optional files: string[];
```

**Defined in:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts)

---

### WithWorkspaces

```ts
type WithWorkspaces = {
	all?: boolean;
	workspaces?: string[];
};
```

**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

#### Properties

##### all?

```ts
optional all: boolean;
```

**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

##### workspaces?

```ts
optional workspaces: string[];
```

**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

## Variables

### withAffected()

```ts
const withAffected: <T>(yargs) => Yargs<T & WithAffected>;
```

**Defined in:** [modules/builders/src/with-affected.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-affected.ts)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type                                |
| --------- | ----------------------------------- |
| `yargs`   | [`Yargs`](../../../#yargs-2)\<`T`\> |

**Returns:** [`Yargs`](../../../#yargs-2)\<`T` & [`WithAffected`](#withaffected-1)\>

---

### withAllInputs()

```ts
const withAllInputs: (yargs) => Yargs<WithAllInputs>;
```

**Defined in:** [modules/builders/src/with-all-inputs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-all-inputs.ts)  
**Parameters:**

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `yargs`   | [`Yargs`](../../../#yargs-2)\<[`DefaultArgv`](../../../#defaultargv)\> |

**Returns:** [`Yargs`](../../../#yargs-2)\<[`WithAllInputs`](#withallinputs-1)\>

---

### withFiles()

```ts
const withFiles: <T>(yargs) => Yargs<T & WithFiles>;
```

**Defined in:** [modules/builders/src/with-files.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-files.ts)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type                                |
| --------- | ----------------------------------- |
| `yargs`   | [`Yargs`](../../../#yargs-2)\<`T`\> |

**Returns:** [`Yargs`](../../../#yargs-2)\<`T` & [`WithFiles`](#withfiles-1)\>

---

### withWorkspaces()

```ts
const withWorkspaces: <T>(yargs) => Yargs<T & WithWorkspaces>;
```

**Defined in:** [modules/builders/src/with-workspaces.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/with-workspaces.ts)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

**Parameters:**

| Parameter | Type                                |
| --------- | ----------------------------------- |
| `yargs`   | [`Yargs`](../../../#yargs-2)\<`T`\> |

**Returns:** [`Yargs`](../../../#yargs-2)\<`T` & [`WithWorkspaces`](#withworkspaces-1)\>

## Functions

### getAffected()

```ts
function getAffected(graph, __namedParameters?): Promise<Workspace[]>;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)  
**Parameters:**

| Parameter            | Type                              |
| -------------------- | --------------------------------- |
| `graph`              | [`Graph`](../../../#graph)        |
| `__namedParameters?` | [`GetterOptions`](#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](../../../#workspace)[]\>

---

### getFilepaths()

```ts
function getFilepaths(graph, argv, __namedParameters?): Promise<string[]>;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)  
**Parameters:**

| Parameter            | Type                                      |
| -------------------- | ----------------------------------------- |
| `graph`              | [`Graph`](../../../#graph)                |
| `argv`               | [`WithAllInputs`](#withallinputs-1)       |
| `__namedParameters?` | [`FileGetterOptions`](#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

---

### getWorkspaces()

```ts
function getWorkspaces(graph, argv, __namedParameters?): Promise<Workspace[]>;
```

**Defined in:** [modules/builders/src/getters.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/builders/src/getters.ts)  
**Parameters:**

| Parameter            | Type                                |
| -------------------- | ----------------------------------- |
| `graph`              | [`Graph`](../../../#graph)          |
| `argv`               | [`WithAllInputs`](#withallinputs-1) |
| `__namedParameters?` | [`GetterOptions`](#getteroptions)   |

**Returns:** `Promise`\<[`Workspace`](../../../#workspace)[]\>

<!-- end-onerepo-sentinel -->
