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
<!-- @generated SignedSource<<aab6d38f21d414985b750e546406754d>> -->

File manipulation functions.

This package is also canonically available from the `onerepo` package under the `file` namespace or methods directly from `@onerepo/file`:

## Example

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

#### Type declaration

##### step?

```ts
step?: LogStep;
```

Avoid creating a new step in output for each function.
Pass a Logger Step to pipe all logs and output to that instead.

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L25)

---

### ReadSafeOptions

```ts
type ReadSafeOptions: {
  sentinel: string;
  step: LogStep;
};
```

#### Type declaration

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

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L156)

---

### SigningStatus

```ts
type SigningStatus: "valid" | "invalid" | "unsigned";
```

#### Source

[modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts#L1)

---

### WriteOptions

```ts
type WriteOptions: {
  sign: boolean;
  step: LogStep;
};
```

#### Type declaration

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

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L55)

---

### WriteSafeOptions

```ts
type WriteSafeOptions: {
  sentinel: string;
  sign: boolean;
  step: LogStep;
};
```

#### Type declaration

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

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L127)

## Functions

### chmod()

```ts
chmod(
   filename,
   mode,
options?): Promise<void>
```

Change file permissions

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `mode`     | `string` \| `number`  |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.chmod('/foo', 'a+x');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L193)

---

### copy()

```ts
copy(
   input,
   output,
options?): Promise<void>
```

Copy a file from one location to another.

If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `input`    | `string`              |
| `output`   | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.copy('/path/to/in/', '/path/to/out/');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L87)

---

### exists()

```ts
exists(filename, options?): Promise<boolean>
```

Step-wrapped `fs.existsSync` implementation.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`boolean`\>

#### Example

```ts
await file.exists('/path/to/file.ts');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L40)

---

### isSigned()

```ts
isSigned(contents): boolean
```

Checks whether a file is signed _without_ verifying the signature.

#### Parameters

| Parameter  | Type     |
| :--------- | :------- |
| `contents` | `string` |

#### Returns

`boolean`

#### Source

[modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts#L10)

---

### lstat()

```ts
lstat(filename, options?): Promise<Stats | null>
```

Step-wrapped `fs.lstat` implementation. See the [node.js fs.Stats documentation](https://nodejs.org/api/fs.html#class-fsstats) for more on how to use the return data.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`Stats` \| `null`\>

If the `filename` does not exist, `null` will be returned instead of a Stats object.

#### Example

```ts
const stat = await file.lstat('/path/to/file/');
if (stat.isDirectory()) {
	/* ... */
}
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L99)

---

### makeTempDir()

```ts
makeTempDir(prefix, options?): Promise<string>
```

Create a tmp directory in the os tmpdir.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `prefix`   | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`string`\>

#### Example

```ts
const dir = await file.makeTempDir('tacos-');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L184)

---

### mkdirp()

```ts
mkdirp(pathname, options?): Promise<void>
```

Recursively create a directory.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `pathname` | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.mkdirp('/path/to/something');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L117)

---

### read()

```ts
read(
   filename,
   flag?,
options?): Promise<string>
```

Read the contents of a file.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `flag`?    | `OpenMode`            |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`string`\>

#### Example

```ts
const contents = await file.read('/path/to/file/');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L108)

---

### readSafe()

```ts
readSafe(filename, options?): Promise<[string | null, string]>
```

Read a sentinel-wrapped portion of a file that was previously written with [writeSafe](#writesafe) and return both the wrapped portion as well as the full contents of the file.

#### Parameters

| Parameter  | Type                                  |
| :--------- | :------------------------------------ |
| `filename` | `string`                              |
| `options`? | [`ReadSafeOptions`](#readsafeoptions) |

#### Returns

`Promise`\<[`string` \| `null`, `string`]\>

#### Example

```ts
const [portion, fullContents] = await file.readSafe('/path/to/file/', { sentinel: 'tacos' });
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L175)

---

### remove()

```ts
remove(pathname, options?): Promise<void>
```

Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `pathname` | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.remove('/path/to/something');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L126)

---

### signContents()

```ts
signContents(
   filename,
   contents,
options?): Promise<any>
```

Sign the contents for a given file without writing out. This function is typically useful for manually comparing signed file contents.

#### Parameters

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `filename` | `string`              |
| `contents` | `string`              |
| `options`? | [`Options`](#options) |

#### Returns

`Promise`\<`any`\>

#### Example

```ts
const filename = graph.root.resolve('README.md');
const currentContents = await file.read(filename);
const newContents = generateReadme();
if (currentContents !== (await signContents(filename, contents))) {
	logger.error('Contents mismatch');
}
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L54)

---

### verifySignature()

```ts
verifySignature(contents): SigningStatus
```

Verify the signature in a signed file.

#### Parameters

| Parameter  | Type     |
| :--------- | :------- |
| `contents` | `string` |

#### Returns

[`SigningStatus`](#signingstatus)

#### Source

[modules/file/src/signing.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/signing.ts#L14)

---

### write()

```ts
write(
   filename,
   contents,
options?): Promise<void>
```

Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.

If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.

#### Parameters

| Parameter  | Type                            |
| :--------- | :------------------------------ |
| `filename` | `string`                        |
| `contents` | `string`                        |
| `options`? | [`WriteOptions`](#writeoptions) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.write('/path/to/out/', '# hello!');
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L76)

---

### writeSafe()

```ts
writeSafe(
   filename,
   contents,
options?): Promise<void>
```

Safely write contents to a file, wrapped in a start and end sentinel. This allows writing to a file without overwriting the current content of the file – other than that which falls between the start and end sentinel.

#### Parameters

| Parameter  | Type                                    |
| :--------- | :-------------------------------------- |
| `filename` | `string`                                |
| `contents` | `string`                                |
| `options`? | [`WriteSafeOptions`](#writesafeoptions) |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await file.writeSafe('/path/to/out/', '# hello', { sentinel: 'some-unique-string' });
```

#### Example

```ts
await file.writeSafe('/path/to/out/', '# hello', { signed: true });
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L155)

<!-- end-onerepo-sentinel -->
