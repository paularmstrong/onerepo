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
<!-- @generated SignedSource<<c287018a8ce4b37238ab786e0e6c0da9>> -->

Special handlers for managing complex queries and manipulation of the git repository's state.

## Classes

### StagingWorkflow

#### Constructors

##### new StagingWorkflow()

```ts
new StagingWorkflow(options): StagingWorkflow
```

**Parameters:**

| Parameter        | Type                                                                         | Description                            |
| ---------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `options`        | \{ `graph`: [`Graph`](../../#graph); `logger`: [`Logger`](../../#logger); \} | -                                      |
| `options.graph`  | [`Graph`](../../#graph)                                                      | The repository Graph                   |
| `options.logger` | [`Logger`](../../#logger)                                                    | Logger instance to use for all actions |

**Returns:** [`StagingWorkflow`](#stagingworkflow)  
**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

#### Methods

##### restoreUnstaged()

```ts
restoreUnstaged(): Promise<void>
```

Restores the unstaged changes previously backed up by [\`saveUnstaged()\`](#saveunstaged).

This command will go through a series of attempts to ressurect upon failure, eventually throwing an error if unstaged changes cannot be reapplied.

**Returns:** `Promise`\<`void`\>  
**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

##### saveUnstaged()

```ts
saveUnstaged(): Promise<void>
```

Backup any unstaged changes, whether that's full files or parts of files. This will result in the git status only including what was already in the stage. All other changes will be backed up to:

1. A patch file in the `.git/` directory
2. A git stash

To restore the unstaged changes, call [\`restoreUnstaged()\`](#restoreunstaged).

**Returns:** `Promise`\<`void`\>  
**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

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

##### from?

```ts
optional from: string;
```

Git ref for start (exclusive) to get list of modified files

##### staged?

```ts
optional staged: false;
```

Cannot include `staged` files when using from/through refs.

##### through?

```ts
optional through: string;
```

Git ref for end (inclusive) to get list of modified files

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

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

##### from?

```ts
optional from: never;
```

Disallowed when `staged: true`

##### staged

```ts
staged: true;
```

Get staged modified files only

##### through?

```ts
optional through: never;
```

Disallowed when `staged: true`

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### Options

```ts
type Options: {
  step: LogStep;
};
```

Generic options passed to all Git operations.

#### Type declaration

##### step?

```ts
optional step: LogStep;
```

Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead.

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### UpdateIndexOptions

```ts
type UpdateIndexOptions: Options & {
  immediately: boolean;
};
```

#### Type declaration

##### immediately?

```ts
optional immediately: boolean;
```

Set whether to immediately add to the git index or defer until process shutdown

**Default:** `false`  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

## Functions

### flushUpdateIndex()

```ts
function flushUpdateIndex(options?): Promise<void>;
```

Write all pending files added using [\`updateIndex()\`](#updateindex) to the git index.

```ts
await git.flushUpdateIndex();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### getBranch()

```ts
function getBranch(options?): Promise<string>;
```

Get the name of the current branch. Equivalent to `git rev-parse --abbrev-ref HEAD`.

```ts
const currentBranch = await git.getBranch();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### getCurrentSha()

```ts
function getCurrentSha(options?): Promise<string>;
```

Get the current sha ref. This is equivalent to `git rev-parse HEAD`.

```ts
const sha = await git.getCurrentSha();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### getMergeBase()

```ts
function getMergeBase(options?): Promise<string>;
```

Determine the git ref for merging the current working branch, sha, or ref, whichever that is. This function does a bunch of internal checks to determine the where the most likely point of forking happened.

```ts
const mergeBase = await getMergeBase();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### getModifiedFiles()

```ts
function getModifiedFiles(modified?, options?): Promise<string[]>;
```

Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will current merge-base determination to best get the change to the working tree using `git diff` and `git diff-tree`.

```ts
const changesSinceMergeBase = await git.getModifiedFiles();
const betweenRefs = await git.getModifiedFiles('v1.2.3', 'v2.0.0');
```

**Parameters:**

| Parameter   | Type                                                                                 |
| ----------- | ------------------------------------------------------------------------------------ |
| `modified`? | [`ModifiedStaged`](#modifiedstaged) \| [`ModifiedFromThrough`](#modifiedfromthrough) |
| `options`?  | [`Options`](#options)                                                                |

**Returns:** `Promise`\<`string`[]\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### isClean()

```ts
function isClean(options?): Promise<boolean>;
```

Check if the current git working state is clean.

```ts
const isClean = await git.isClean();
if (!isClean) {
	// There are local modifications that have not yet been committed.
}
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`boolean`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

---

### updateIndex()

```ts
function updateIndex(paths, options?): Promise<string | undefined>;
```

Add filepaths to the git index. Equivalent to `git add [...files]`. By default, this method will track the files that need to be added to the git index. It will only add files immediately if given the `immediately` option.

Use [\`flushUpdateIndex()\`](#flushupdateindex) to write all tracked files the git index. This method is automatically called during the oneRepo command shutdown process, so you may not ever need to call this.

It is best to avoid immediately adding items to the git index to avoid race conditions which can drop git into a bad state, requiring users to manually delete their `.git/index.lock` file before continuing.

```ts
await git.updateIndex(['tacos.ts']);
```

**Parameters:**

| Parameter  | Type                                        |
| ---------- | ------------------------------------------- |
| `paths`    | `string` \| `string`[]                      |
| `options`? | [`UpdateIndexOptions`](#updateindexoptions) |

**Returns:** `Promise`\<`string` \| `undefined`\>  
**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

<!-- end-onerepo-sentinel -->
