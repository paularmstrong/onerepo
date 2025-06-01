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
<!-- @generated SignedSource<<6e0589abae1fafa374c55f4bf9bc38b2>> -->

Special handlers for managing complex queries and manipulation of the git repository's state.

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

| Parameter        | Type                                                                                     | Description                            |
| ---------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| `options`        | \{ `graph`: [`Graph`](../../../../#graph); `logger`: [`Logger`](../../../../#logger); \} | -                                      |
| `options.graph`  | [`Graph`](../../../../#graph)                                                            | The repository Graph                   |
| `options.logger` | [`Logger`](../../../../#logger)                                                          | Logger instance to use for all actions |

**Returns:** [`StagingWorkflow`](#stagingworkflow)

#### Methods

##### restoreUnstaged()

```ts
restoreUnstaged(): Promise<void>;
```

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

Restores the unstaged changes previously backed up by [\`saveUnstaged()\`](#saveunstaged).

This command will go through a series of attempts to ressurect upon failure, eventually throwing an error if unstaged changes cannot be reapplied.

**Returns:** `Promise`\<`void`\>

##### saveUnstaged()

```ts
saveUnstaged(): Promise<void>;
```

**Defined in:** [modules/git/src/workflow.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/workflow.ts)

Backup any unstaged changes, whether that's full files or parts of files. This will result in the git status only including what was already in the stage. All other changes will be backed up to:

1. A patch file in the `.git/` directory
2. A git stash

To restore the unstaged changes, call [\`restoreUnstaged()\`](#restoreunstaged).

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

By default, this function will not return `deleted` and `unmerged` files unless either `allStatus` or `byStatus` is set to `true`

##### byStatus?

```ts
optional byStatus: ByStatus;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Return modified files categorized by the [type of modification](#modifiedbystatus) (added, deleted, modified, etc)

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

This type defines the different statuses of files when running a git-diff. More information around the file statuses can be found in the official git documentation for [git-diff](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt-git-diff-filesltpatterngt82308203).

#### Properties

##### added

```ts
added: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `A`: addition of a file

##### copied

```ts
copied: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `C`: copy of a file into a new one

##### deleted

```ts
deleted: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `D`: deletion of a file

##### fileTypeChanged

```ts
fileTypeChanged: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `T`: change in the type of the file (regular file, symbolic link or submodule)

##### modified

```ts
modified: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `M`: modification of the contents or mode of a file

##### renamed

```ts
renamed: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `R`: renaming of a file

##### unknown

```ts
unknown: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `X`: addition of a file

##### unmerged

```ts
unmerged: string[];
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Git status `U`: "unknown" change type (most probably a bug, please report it)

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

Generic options passed to all Git operations.

#### Properties

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead.

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

Set whether to immediately add to the git index or defer until process shutdown

**Default:** `false`

## Functions

### flushUpdateIndex()

```ts
function flushUpdateIndex(options?): Promise<void>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Write all pending files added using [\`updateIndex()\`](#updateindex) to the git index.

```ts
await git.flushUpdateIndex();
```

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

Get the name of the current branch. Equivalent to `git rev-parse --abbrev-ref HEAD`.

```ts
const currentBranch = await git.getBranch();
```

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

Get the current sha ref. This is equivalent to `git rev-parse HEAD`.

```ts
const sha = await git.getCurrentSha();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### getMergeBase()

```ts
function getMergeBase(options?): Promise<string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Determine the git ref for merging the current working branch, sha, or ref, whichever that is. This function does a bunch of internal checks to determine the where the most likely point of forking happened.

```ts
const mergeBase = await getMergeBase();
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### getModifiedFiles()

```ts
function getModifiedFiles<ByStatus>(modified?, options?): Promise<ByStatus extends true ? ModifiedByStatus : string[]>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

Get a map of the currently modified files based on their status. If `from` and `through` are not provided, this will use merge-base determination to get the changes to the working tree using `git diff` and `git diff-tree`.

By default, this function will not return `deleted` and `unmerged` files. If you wish to include files with those statuses, set the option `allStatus: true` or get a map of all files by status using `byStatus: true`.

```ts
const changesSinceMergeBase = await git.getModifiedFiles();
const betweenRefs = await git.getModifiedFiles({ from: 'v1.2.3', through: 'v2.0.0' });
```

Get modified files categorized by modification type:

```ts
const allChanges = await git.getModifiedFiles({ byStatus: true });
```

Will result in `allChanges` equal to an object containing arrays of strings:

```ts
{
	added: [/* ... */],
	copied: [/* ... */],
	modified: [/* ... */],
	deleted: [/* ... */],
	renamed: [/* ... */],
	fileTypeChanged: [/* ... */],
	unmerged: [/* ... */],
	unknown: [/* ... */],
}
```

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
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`boolean`\>

---

### updateIndex()

```ts
function updateIndex(paths, options?): Promise<undefined | string>;
```

**Defined in:** [modules/git/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/git/src/index.ts)

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
| `options?` | [`UpdateIndexOptions`](#updateindexoptions) |

**Returns:** `Promise`\<`undefined` \| `string`\>

<!-- end-onerepo-sentinel -->
