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
<!-- @generated SignedSource<<6b39faa68f07a155b881e91a2c54d872>> -->

File manipulation functions.

This package is also canonically available from the `onerepo` package under the `file` namespace or methods directly from `@onerepo/file`:

```ts {1,4}
import { file } from 'onerepo';

export handler: Handler =  async () => {
	await file.write('my-file', 'contents');
};
```

## Type Aliases

### Options

```ts
type Options: {
  step: LogStep;
};
```

Generic options for file functions

**Type declaration:**

##### step?

```ts
step?: LogStep;
```

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### ReadSafeOptions

```ts
type ReadSafeOptions: {
  sentinel: string;
  step: LogStep;
};
```

**Type declaration:**

##### sentinel?

```ts
sentinel?: string;
```

Unique string to use as a start and end sentinel for the contents

##### step?

```ts
step?: LogStep;
```

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### SigningStatus

```ts
type SigningStatus: "valid" | "invalid" | "unsigned";
```

**Source:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

---

### WriteOptions

```ts
type WriteOptions: {
  sign: boolean;
  step: LogStep;
};
```

**Type declaration:**

##### sign?

```ts
sign?: boolean;
```

Optionally sign the contents for future verification.

##### step?

```ts
step?: LogStep;
```

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### WriteSafeOptions

```ts
type WriteSafeOptions: {
  sentinel: string;
  sign: boolean;
  step: LogStep;
};
```

**Type declaration:**

##### sentinel?

```ts
sentinel?: string;
```

Unique string to use as a start and end sentinel for the contents

##### sign?

```ts
sign?: boolean;
```

Optionally sign the contents for future verification.

##### step?

```ts
step?: LogStep;
```

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

## Functions

### chmod()

```ts
chmod(
   filename,
   mode,
options?): Promise<void>
```

Change file permissions

```ts
await file.chmod('/foo', 'a+x');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `mode`     | `string` \| `number`  |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### copy()

```ts
copy(
   input,
   output,
options?): Promise<void>
```

Copy a file from one location to another.

If `--dry-run` or `process.env.ONEREPO_DRY_RUN` is true, no files will be modified.

```ts
await file.copy('/path/to/in/', '/path/to/out/');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `input`    | `string`              |
| `output`   | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### exists()

```ts
exists(filename, options?): Promise<boolean>
```

Step-wrapped `fs.existsSync` implementation.

```ts
await file.exists('/path/to/file.ts');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`boolean`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### isSigned()

```ts
isSigned(contents): boolean
```

Checks whether a file is signed _without_ verifying the signature.

**Parameters:**

| Parameter  | Type     |
| :--------- | :------- |
| `contents` | `string` |

**Returns:** `boolean`  
**Source:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

---

### lstat()

```ts
lstat(filename, options?): Promise<Stats | null>
```

Step-wrapped `fs.lstat` implementation. See the [node.js fs.Stats documentation](https://nodejs.org/api/fs.html#class-fsstats) for more on how to use the return data.

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`Stats` \| `null`\>

If the `filename` does not exist, `null` will be returned instead of a Stats object.

```ts
const stat = await file.lstat('/path/to/file/');
if (stat.isDirectory()) {
	/* ... */
}
```

**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### makeTempDir()

```ts
makeTempDir(prefix, options?): Promise<string>
```

Create a tmp directory in the os tmpdir.

```ts
const dir = await file.makeTempDir('tacos-');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `prefix`   | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### mkdirp()

```ts
mkdirp(pathname, options?): Promise<void>
```

Recursively create a directory.

```ts
await file.mkdirp('/path/to/something');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `pathname` | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### read()

```ts
read(
   filename,
   flag?,
options?): Promise<string>
```

Read the contents of a file.

```ts
const contents = await file.read('/path/to/file/');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `flag`?    | `OpenMode`            |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`string`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### readSafe()

```ts
readSafe(filename, options?): Promise<[string | null, string]>
```

Read a sentinel-wrapped portion of a file that was previously written with [writeSafe](#writesafe) and return both the wrapped portion as well as the full contents of the file.

```ts
const [portion, fullContents] = await file.readSafe('/path/to/file/', { sentinel: 'tacos' });
```

**Parameters:**

| Parameter  | Type                                  |
| :--------- | :------------------------------------ |
| `filename` | `string`                              |
| `options`? | [`ReadSafeOptions`](#readsafeoptions) |

**Returns:** `Promise`\<[`string` \| `null`, `string`]\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### remove()

```ts
remove(pathname, options?): Promise<void>
```

Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`

```ts
await file.remove('/path/to/something');
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `pathname` | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### signContents()

```ts
signContents(
   filename,
   contents,
options?): Promise<any>
```

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
| :--------- | :-------------------- |
| `filename` | `string`              |
| `contents` | `string`              |
| `options`? | [`Options`](#options) |

**Returns:** `Promise`\<`any`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### verifySignature()

```ts
verifySignature(contents): SigningStatus
```

Verify the signature in a signed file.

**Parameters:**

| Parameter  | Type     |
| :--------- | :------- |
| `contents` | `string` |

**Returns:** [`SigningStatus`](#signingstatus)  
**Source:** [modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts)

---

### write()

```ts
write(
   filename,
   contents,
options?): Promise<void>
```

Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.

If `--dry-run` or `process.env.ONEREPO_DRY_RUN` is true, no files will be modified.

```ts
await file.write('/path/to/out/', '# hello!');
```

**Parameters:**

| Parameter  | Type                            |
| :--------- | :------------------------------ |
| `filename` | `string`                        |
| `contents` | `string`                        |
| `options`? | [`WriteOptions`](#writeoptions) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

---

### writeSafe()

```ts
writeSafe(
   filename,
   contents,
options?): Promise<void>
```

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
| :--------- | :-------------------------------------- |
| `filename` | `string`                                |
| `contents` | `string`                                |
| `options`? | [`WriteSafeOptions`](#writesafeoptions) |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

<!-- end-onerepo-sentinel -->
