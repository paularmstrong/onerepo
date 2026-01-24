---
title: 'oneRepo API: git'
sidebar:
  label: git
---

<!--

DO NOT EDIT BELOW THIS LINE.
All content is auto-generated using a oneRepo command:

  $ one docs typedoc

-->

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<f5029686f9ccae1f062ace09730e9e76>> -->

## Classes

### StagingWorkflow

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

#### Constructors

##### Constructor

```ts
new StagingWorkflow(options): StagingWorkflow;
```

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)  
**Parameters:**

| Parameter        | Type                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| `options`        | \{ `graph`: [`Graph`](../../../#graph); `logger`: [`Logger`](../../../#logger); \} |
| `options.graph`  | [`Graph`](../../../#graph)                                                         |
| `options.logger` | [`Logger`](../../../#logger)                                                       |

**Returns:** [`StagingWorkflow`](#stagingworkflow)

#### Methods

##### restoreUnstaged()

```ts
restoreUnstaged(): Promise<void>;
```

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)  
**Returns:** `Promise`\<`void`\>

##### saveUnstaged()

```ts
saveUnstaged(): Promise<void>;
```

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)  
**Returns:** `Promise`\<`void`\>

## Type Aliases

### ModifiedBaseOptions\<ByStatus\>

```ts
type ModifiedBaseOptions<ByStatus> = {
	allStatus?: boolean;
	byStatus?: ByStatus;
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Type Parameters

| Type Parameter                 | Default type |
| ------------------------------ | ------------ |
| `ByStatus` _extends_ `boolean` | `false`      |

#### Properties

##### allStatus?

```ts
optional allStatus: boolean;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### byStatus?

```ts
optional byStatus: ByStatus;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### ModifiedByStatus

```ts
type ModifiedByStatus = {
	added: string[];
	copied: string[];
	deleted: string[];
	fileTypeChanged: string[];
	modified: string[];
	renamed: string[];
	unknown: string[];
	unmerged: string[];
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Properties

##### added

```ts
added: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### copied

```ts
copied: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### deleted

```ts
deleted: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### fileTypeChanged

```ts
fileTypeChanged: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### modified

```ts
modified: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### renamed

```ts
renamed: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### unknown

```ts
unknown: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

##### unmerged

```ts
unmerged: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### ModifiedFromThrough\<ByStatus\>

```ts
type ModifiedFromThrough<ByStatus> = ModifiedBaseOptions<ByStatus> & {
	from?: string;
	staged?: false;
	through?: string;
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Type declaration

##### from?

```ts
optional from: string;
```

##### staged?

```ts
optional staged: false;
```

##### through?

```ts
optional through: string;
```

#### Type Parameters

| Type Parameter                 |
| ------------------------------ |
| `ByStatus` _extends_ `boolean` |

---

### ModifiedStaged\<ByStatus\>

```ts
type ModifiedStaged<ByStatus> = ModifiedBaseOptions<ByStatus> & {
	from?: never;
	staged: true;
	through?: never;
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Type declaration

##### from?

```ts
optional from: never;
```

##### staged

```ts
staged: true;
```

##### through?

```ts
optional through: never;
```

#### Type Parameters

| Type Parameter                 |
| ------------------------------ |
| `ByStatus` _extends_ `boolean` |

---

### Options

```ts
type Options = {
	step?: LogStep;
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Properties

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### UpdateIndexOptions

```ts
type UpdateIndexOptions = Options & {
	immediately?: boolean;
};
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Type declaration

##### immediately?

```ts
optional immediately: boolean;
```

## Functions

### flushUpdateIndex()

```ts
function flushUpdateIndex(options?): Promise<void>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>

---

### getBranch()

```ts
function getBranch(options?): Promise<string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### getCurrentSha()

```ts
function getCurrentSha(options?): Promise<string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### getMergeBase()

```ts
function getMergeBase(options?): Promise<undefined | string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`undefined` \| `string`\>

---

### getModifiedFiles()

```ts
function getModifiedFiles<ByStatus>(modified?, options?): Promise<ByStatus extends true ? ModifiedByStatus : string[]>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

#### Type Parameters

| Type Parameter                 | Default type |
| ------------------------------ | ------------ |
| `ByStatus` _extends_ `boolean` | `false`      |

**Parameters:**

| Parameter   | Type                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `modified?` | \| [`ModifiedStaged`](#modifiedstaged)\<`ByStatus`\> \| [`ModifiedFromThrough`](#modifiedfromthrough)\<`ByStatus`\> |
| `options?`  | [`Options`](#options)                                                                                               |

**Returns:** `Promise`\<`ByStatus` _extends_ `true` ? [`ModifiedByStatus`](#modifiedbystatus) : `string`[]\>

---

### isClean()

```ts
function isClean(options?): Promise<boolean>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`boolean`\>

---

### updateIndex()

```ts
function updateIndex(paths, options?): Promise<undefined | string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)  
**Parameters:**

| Parameter  | Type                                        |
| ---------- | ------------------------------------------- |
| `paths`    | `string` \| `string`[]                      |
| `options?` | [`UpdateIndexOptions`](#updateindexoptions) |

**Returns:** `Promise`\<`undefined` \| `string`\>

<!-- end-onerepo-sentinel -->
