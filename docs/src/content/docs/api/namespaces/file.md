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
<!-- @generated SignedSource<<ca5c5770cc031cfb92d8ef06a72fdf8b>> -->

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
type Options: Object;
```

Generic options for file functions

#### Type declaration

| Member | Type                        | Description                                                                                                                 |
| :----- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `step` | [`LogStep`](../../#logstep) | Avoid creating a new step in output for each function.<br />Pass a Logger Step to pipe all logs and output to that instead. |

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L25)

---

### ReadSafeOptions

```ts
type ReadSafeOptions: Object;
```

#### Type declaration

| Member     | Type                        | Description                                                                                                                 |
| :--------- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `sentinel` | `string`                    | Unique string to use as a start and end sentinel for the contents                                                           |
| `step`     | [`LogStep`](../../#logstep) | Avoid creating a new step in output for each function.<br />Pass a Logger Step to pipe all logs and output to that instead. |

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
type WriteOptions: Object;
```

#### Type declaration

| Member | Type                        | Description                                                                                                                 |
| :----- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `sign` | `boolean`                   | Optionally sign the contents for future verification.                                                                       |
| `step` | [`LogStep`](../../#logstep) | Avoid creating a new step in output for each function.<br />Pass a Logger Step to pipe all logs and output to that instead. |

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L55)

---

### WriteSafeOptions

```ts
type WriteSafeOptions: Object;
```

#### Type declaration

| Member     | Type                        | Description                                                                                                                 |
| :--------- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `sentinel` | `string`                    | Unique string to use as a start and end sentinel for the contents                                                           |
| `sign`     | `boolean`                   | Optionally sign the contents for future verification.                                                                       |
| `step`     | [`LogStep`](../../#logstep) | Avoid creating a new step in output for each function.<br />Pass a Logger Step to pipe all logs and output to that instead. |

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

• **filename**: `string`

• **mode**: `string` \| `number`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`void`\>

#### Example

Make the file `/foo` executable.

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

• **input**: `string`

• **output**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`void`\>

#### Example

Copy `/path/to/in/` to `/path/to/out/`.

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

• **filename**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`boolean`\>

#### Example

Check whether the file `/path/to/file.ts` exists.

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

• **contents**: `string`

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

• **filename**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`Stats` \| `null`\>

If the `filename` does not exist, `null` will be returned instead of a Stats object.

#### Example

Get the stats of `/path/to/file/`.

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

• **prefix**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`string`\>

#### Example

Make a temp directory with the prefix `tacos-`

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

• **pathname**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`void`\>

#### Example

Make a directory (recursively) at `/path/to/something`.

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

• **filename**: `string`

• **flag?**: `OpenMode`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`string`\>

#### Example

Read the contents of the file `/path/to/file/`.

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

• **filename**: `string`

• **options?**: [`ReadSafeOptions`](#readsafeoptions)

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

• **pathname**: `string`

• **options?**: [`Options`](#options)

#### Returns

`Promise`\<`void`\>

#### Example

Remove the path at `/path/to/something`.

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

• **filename**: `string`

• **contents**: `string`

• **options?**: [`Options`](#options)

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

• **contents**: `string`

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

• **filename**: `string`

• **contents**: `string`

• **options?**: [`WriteOptions`](#writeoptions)

#### Returns

`Promise`\<`void`\>

#### Example

Write to `/path/to/out/`.

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

• **filename**: `string`

• **contents**: `string`

• **options?**: [`WriteSafeOptions`](#writesafeoptions)

#### Returns

`Promise`\<`void`\>

#### Example

Write to `/path/to/out/` between a section denoted by the sentinel `'some-unique-string'` while leaving the rest of the file intact.

```ts
await file.writeSafe('/path/to/out/', '# hello', { sentinel: 'some-unique-string' });
```

#### Example

Write to a section of the file as signed content for verifying later.

```ts
await file.writeSafe('/path/to/out/', '# hello', { signed: true });
```

#### Source

[modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L155)

<!-- end-onerepo-sentinel -->
