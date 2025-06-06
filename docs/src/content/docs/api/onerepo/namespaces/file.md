---
title: 'oneRepo API: file'
sidebar:
  label: file
---

<!--

DO NOT EDIT BELOW THIS LINE.
All content is auto-generated using a oneRepo command:

  $ one docs typedoc

-->

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<58f2eb34dbab5726f2ba3d492fb38a7d>> -->

File manipulation functions.

## Type Aliases

### Options

```ts
type Options = {
	step?: LogStep;
};
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Generic options for file functions

#### Properties

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

---

### ReadJsonOptions

```ts
type ReadJsonOptions = {
	jsonc?: boolean;
} & Options;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

#### Type declaration

##### jsonc?

```ts
optional jsonc: boolean;
```

Parse the file as JSONC (JSON with comments).

---

### ReadSafeOptions

```ts
type ReadSafeOptions = {
	sentinel?: string;
	step?: LogStep;
};
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

#### Properties

##### sentinel?

```ts
optional sentinel: string;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Unique string to use as a start and end sentinel for the contents

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

---

### SigningStatus

```ts
type SigningStatus = 'valid' | 'invalid' | 'unsigned';
```

**Defined in:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

---

### WriteOptions

```ts
type WriteOptions = {
	sign?: boolean;
	step?: LogStep;
};
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

#### Properties

##### sign?

```ts
optional sign: boolean;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Optionally sign the contents for future verification.

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

---

### WriteSafeOptions

```ts
type WriteSafeOptions = {
	sentinel?: string;
	sign?: boolean;
	step?: LogStep;
};
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

#### Properties

##### sentinel?

```ts
optional sentinel: string;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Unique string to use as a start and end sentinel for the contents

##### sign?

```ts
optional sign: boolean;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Optionally sign the contents for future verification.

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

## Functions

### chmod()

```ts
function chmod(filename, mode, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Change file permissions

```ts
await file.chmod('/foo', 'a+x');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `mode`     | `string` \| `number`  |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>

---

### copy()

```ts
function copy(input, output, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Copy a file from one location to another.

If `--dry-run` or `process.env.ONEREPO_DRY_RUN` is true, no files will be modified.

```ts
await file.copy('/path/to/in/', '/path/to/out/');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `input`    | `string`              |
| `output`   | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>

---

### exists()

```ts
function exists(filename, options?): Promise<boolean>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Step-wrapped `fs.existsSync` implementation.

```ts
await file.exists('/path/to/file.ts');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`boolean`\>

---

### isSigned()

```ts
function isSigned(contents): boolean;
```

**Defined in:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

Checks whether a file is signed _without_ verifying the signature.

**Parameters:**

| Parameter  | Type     |
| ---------- | -------- |
| `contents` | `string` |

**Returns:** `boolean`

---

### lstat()

```ts
function lstat(filename, options?): Promise<null | Stats>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Step-wrapped `fs.lstat` implementation. See the [node.js fs.Stats documentation](https://nodejs.org/api/fs.html#class-fsstats) for more on how to use the return data.

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`null` \| `Stats`\>

If the `filename` does not exist, `null` will be returned instead of a Stats object.

```ts
const stat = await file.lstat('/path/to/file/');
if (stat.isDirectory()) {
	/* ... */
}
```

---

### makeTempDir()

```ts
function makeTempDir(prefix, options?): Promise<string>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Create a tmp directory in the os tmpdir.

```ts
const dir = await file.makeTempDir('tacos-');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `prefix`   | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### mkdirp()

```ts
function mkdirp(pathname, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Recursively create a directory.

```ts
await file.mkdirp('/path/to/something');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `pathname` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>

---

### read()

```ts
function read(filename, flag?, options?): Promise<string>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Read the contents of a file.

```ts
const contents = await file.read('/path/to/file/');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `flag?`    | `OpenMode`            |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>

---

### readJson()

```ts
function readJson<T>(filename, flag?, options?): Promise<T>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Read and parse a JSON files.

Compatible with jsonc by stripping comments before running `JSON.parse()`. Pass `jsonc: true` to the options to enable jsonc.

```ts
const contents = await file.readJson('/path/to/package.json');
const strippedJsonc = await file.readJson('/path/to/tsconfig.json', 'r', { jsonc: true });
```

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| `T` _extends_ `Record`\<`string`, `unknown`\> |

**Parameters:**

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `filename` | `string`                              |
| `flag?`    | `OpenMode`                            |
| `options?` | [`ReadJsonOptions`](#readjsonoptions) |

**Returns:** `Promise`\<`T`\>

---

### readSafe()

```ts
function readSafe(filename, options?): Promise<[null | string, string]>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Read a sentinel-wrapped portion of a file that was previously written with [writeSafe](#writesafe) and return both the wrapped portion as well as the full contents of the file.

```ts
const [portion, fullContents] = await file.readSafe('/path/to/file/', { sentinel: 'tacos' });
```

**Parameters:**

| Parameter  | Type                                  |
| ---------- | ------------------------------------- |
| `filename` | `string`                              |
| `options?` | [`ReadSafeOptions`](#readsafeoptions) |

**Returns:** `Promise`\<\[`null` \| `string`, `string`\]\>

---

### remove()

```ts
function remove(pathname, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`

```ts
await file.remove('/path/to/something');
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `pathname` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>

---

### signContents()

```ts
function signContents(filename, contents, options?): Promise<any>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Sign the contents for a given file without writing out. This function is typically useful for manually comparing signed file contents.

```ts
const filename = graph.root.resolve('README.md');
const currentContents = await file.read(filename);
const newContents = generateReadme();
if (currentContents !== (await signContents(filename, contents))) {
	logger.error('Contents mismatch');
}
```

**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `contents` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`any`\>

---

### verifySignature()

```ts
function verifySignature(contents): SigningStatus;
```

**Defined in:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

Verify the signature in a signed file.

**Parameters:**

| Parameter  | Type     |
| ---------- | -------- |
| `contents` | `string` |

**Returns:** [`SigningStatus`](#signingstatus)

---

### write()

```ts
function write(filename, contents, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.

If `--dry-run` or `process.env.ONEREPO_DRY_RUN` is true, no files will be modified.

```ts
await file.write('/path/to/out/', '# hello!');
```

**Parameters:**

| Parameter  | Type                            |
| ---------- | ------------------------------- |
| `filename` | `string`                        |
| `contents` | `string`                        |
| `options?` | [`WriteOptions`](#writeoptions) |

**Returns:** `Promise`\<`void`\>

---

### writeSafe()

```ts
function writeSafe(filename, contents, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

Safely write contents to a file, wrapped in a start and end sentinel. This allows writing to a file without overwriting the current content of the file – other than that which falls between the start and end sentinel.

Write to `/path/to/out/` between a section denoted by the sentinel `'some-unique-string'` while leaving the rest of the file intact.

```ts
await file.writeSafe('/path/to/out/', '# hello', { sentinel: 'some-unique-string' });
```

Write to a section of the file as signed content for verifying later.

```ts
await file.writeSafe('/path/to/out/', '# hello', { signed: true });
```

**Parameters:**

| Parameter  | Type                                    |
| ---------- | --------------------------------------- |
| `filename` | `string`                                |
| `contents` | `string`                                |
| `options?` | [`WriteSafeOptions`](#writesafeoptions) |

**Returns:** `Promise`\<`void`\>

<!-- end-onerepo-sentinel -->
