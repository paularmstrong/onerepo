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
<!-- @generated SignedSource<<68d45f0e7bf643bc05222b22de1db44b>> -->

This package is also canonically available from the `onerepo` package under the `git` namespace or methods directly from `@onerepo/git`:

```ts {1,4}
import { git } from 'onerepo';

export handler: Handler =  async () => {
	await git.getBranch();
};
```

## Classes

### StagingWorkflow

#### Constructors

##### new StagingWorkflow(options)

```ts
new StagingWorkflow(options): StagingWorkflow
```

###### Parameters

| Parameter        | Type                                                                  | Description                            |
| :--------------- | :-------------------------------------------------------------------- | :------------------------------------- |
| `options`        | \{ `graph`: [`Graph`](#graph); `logger`: [`Logger`](../../#logger); } | -                                      |
| `options.graph`  | [`Graph`](#graph)                                                     | The repository graph                   |
| `options.logger` | [`Logger`](../../#logger)                                             | Logger instance to use for all actions |

###### Returns

[`StagingWorkflow`](#stagingworkflow)

###### Source

[modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts#L5)

#### Methods

##### restoreUnstaged()

```ts
restoreUnstaged(): Promise<void>
```

Restores the unstaged changes previously backed up by [`saveUnstaged()`](#saveunstaged).

This command will go threw a series of attempts to ressurect upon failure, eventually throwing an error if unstaged changes cannot be reapplied.

###### Returns

`Promise`\<`void`\>

###### Source

[modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts#L29)

##### saveUnstaged()

```ts
saveUnstaged(): Promise<void>
```

Backup any unstaged changes, whether that's full files or parts of files. This will result in the git status only including what was already in the stage. All other changes will be backed up to:

1. A patch file in the `.git/` directory
2. A git stash

To restore the unstaged changes, call [`restoreUnstaged()`](#restoreunstaged).

###### Returns

`Promise`\<`void`\>

###### Source

[modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts#L23)

## Type Aliases

### ModifiedFromThrough

```ts
type ModifiedFromThrough: {
  from: string;
  staged: false;
  through: string;
};
```

#### Type declaration

| Member    | Type     | Description                                                 |
| :-------- | :------- | :---------------------------------------------------------- |
| `from`    | `string` | Git ref for start (exclusive) to get list of modified files |
| `staged`  | `false`  | Cannot include `staged` files when using from/through refs. |
| `through` | `string` | Git ref for end (inclusive) to get list of modified files   |

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L52)

---

### ModifiedStaged

```ts
type ModifiedStaged: {
  from: never;
  staged: true;
  through: never;
};
```

#### Type declaration

| Member    | Type    | Description                    |
| :-------- | :------ | :----------------------------- |
| `from`    | `never` | Disallowed when `staged: true` |
| `staged`  | `true`  | Get staged modified files only |
| `through` | `never` | Disallowed when `staged: true` |

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L66)

---

### Options

```ts
type Options: {
  step: LogStep;
};
```

Generic options passed to all Git operations.

#### Type declaration

| Member | Type                        | Description                                                                                                            |
| :----- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `step` | [`LogStep`](../../#logstep) | Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead. |

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L19)

## Functions

### getBranch()

```ts
getBranch(__namedParameters?): Promise<string>
```

Get the name of the current branch. Equivalent to `git rev-parse --abbrev-ref HEAD`.

```ts
const currentBranch = await git.getBranch();
```

#### Parameters

| Parameter            | Type                  |
| :------------------- | :-------------------- |
| `__namedParameters`? | [`Options`](#options) |

#### Returns

`Promise`\<`string`\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L32)

---

### getCurrentSha()

```ts
getCurrentSha(__namedParameters?): Promise<string>
```

Get the current sha ref. This is equivalent to `git rev-parse HEAD`.

```ts
const sha = await git.getCurrentSha();
```

#### Parameters

| Parameter            | Type                  |
| :------------------- | :-------------------- |
| `__namedParameters`? | [`Options`](#options) |

#### Returns

`Promise`\<`string`\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L96)

---

### getMergeBase()

```ts
getMergeBase(__namedParameters?): Promise<string>
```

Determine the git ref for merging the current working branch, sha, or ref, whichever that is. This function does a bunch of internal checks to determine the where the most likely point of forking happened.

```ts
const mergeBase = await getMergeBase();
```

#### Parameters

| Parameter            | Type                  |
| :------------------- | :-------------------- |
| `__namedParameters`? | [`Options`](#options) |

#### Returns

`Promise`\<`string`\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L40)

---

### getModifiedFiles()

```ts
getModifiedFiles(__namedParameters?, __namedParameters?): Promise<string[]>
```

Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will current merge-base determination to best get the change to the working tree using `git diff` and `git diff-tree`.

```ts
const changesSinceMergeBase = await git.getModifiedFiles();
const betweenRefs = await git.getModifiedFiles('v1.2.3', 'v2.0.0');
```

#### Parameters

| Parameter            | Type                                                                                 |
| :------------------- | :----------------------------------------------------------------------------------- |
| `__namedParameters`? | [`ModifiedStaged`](#modifiedstaged) \| [`ModifiedFromThrough`](#modifiedfromthrough) |
| `__namedParameters`? | [`Options`](#options)                                                                |

#### Returns

`Promise`\<`string`[]\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L88)

---

### isClean()

```ts
isClean(__namedParameters?): Promise<boolean>
```

Check if the current git working state is clean.

```ts
const isClean = await git.isClean();
if (!isClean) {
	// There are local modifications that have not yet been committed.
}
```

#### Parameters

| Parameter            | Type                  |
| :------------------- | :-------------------- |
| `__namedParameters`? | [`Options`](#options) |

#### Returns

`Promise`\<`boolean`\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L51)

---

### updateIndex()

```ts
updateIndex(paths, __namedParameters?): Promise<string>
```

Add filepaths to the git index. Equivalent to `git add [...files]`.

```ts
await git.updateIndex(['tacos.ts']);
```

#### Parameters

| Parameter            | Type                   |
| :------------------- | :--------------------- |
| `paths`              | `string` \| `string`[] |
| `__namedParameters`? | [`Options`](#options)  |

#### Returns

`Promise`\<`string`\>

#### Source

[modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts#L104)

<!-- end-onerepo-sentinel -->
