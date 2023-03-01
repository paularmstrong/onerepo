---
title: 'API: modules/file'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / file

# Namespace: file

## Functions

### exists

**exists**(`filename`, `«destructured»?`): `Promise`<`boolean`\>

Step-wrapped `fs.existsSync` implementation.

```ts
await file.exists('/path/to/file.ts');
```

#### Parameters

| Name             | Type                                              |
| :--------------- | :------------------------------------------------ |
| `filename`       | `string`                                          |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[modules/file/src/index.ts:35](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L35)

---

### lstat

**lstat**(`filename`, `«destructured»?`): `Promise`<`null` \| `Stats`\>

Step-wrapped `fs.lstat` implementation. See the [node.js fs.Stats documentation](https://nodejs.org/api/fs.html#class-fsstats) for more on how to use the return data.

#### Parameters

| Name             | Type                                              |
| :--------------- | :------------------------------------------------ |
| `filename`       | `string`                                          |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) |

#### Returns

`Promise`<`null` \| `Stats`\>

If the `filename` does not exist, `null` will be returned instead of a Stats object.

```ts
const stat = await file.lstat('/path/to/out/');
if (stat.isDirectory()) {
	/* ... */
}
```

#### Defined in

[modules/file/src/index.ts:82](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L82)

---

### mkdirp

**mkdirp**(`pathname`, `«destructured»?`): `Promise`<`void`\>

Recursively create a directory.

```ts
await file.mkdirp('/path/to/something');
```

#### Parameters

| Name             | Type                                              |
| :--------------- | :------------------------------------------------ |
| `pathname`       | `string`                                          |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) |

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/file/src/index.ts:121](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L121)

---

### read

**read**(`filename`, `flag?`, `«destructured»?`): `Promise`<`string`\>

Read the contents of a file.

```ts
const contents = await file.read('/path/to/file/');
```

#### Parameters

| Name             | Type                                              | Default value |
| :--------------- | :------------------------------------------------ | :------------ |
| `filename`       | `string`                                          | `undefined`   |
| `flag`           | `OpenMode`                                        | `'r'`         |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) | `{}`          |

#### Returns

`Promise`<`string`\>

#### Defined in

[modules/file/src/index.ts:100](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L100)

---

### remove

**remove**(`pathname`, `«destructured»?`): `Promise`<`void`\>

Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`

```ts
await file.remove('/path/to/something');
```

#### Parameters

| Name             | Type                                              |
| :--------------- | :------------------------------------------------ |
| `pathname`       | `string`                                          |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) |

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/file/src/index.ts:138](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L138)

---

### write

**write**(`filename`, `contents`, `«destructured»?`): `Promise`<`void`\>

Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.

If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.

```ts
await file.write('/path/to/out/', '# hello!');
```

#### Parameters

| Name             | Type                                              |
| :--------------- | :------------------------------------------------ |
| `filename`       | `string`                                          |
| `contents`       | `string`                                          |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) |

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/file/src/index.ts:50](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L50)

---

### writeSafe

**writeSafe**(`filename`, `contents`, `«destructured»?`): `Promise`<`void`\>

Safely write contents to a file, wrapped in a start and end sentinel. This allows writing to a file without overwriting the current content of the file – other than that which falls between the start and end sentinel.

```ts
await file.writeSafe('/path/to/out/', '# hello', { sentinel: 'some-unique-string' });
```

#### Parameters

| Name             | Type                                                                          |
| :--------------- | :---------------------------------------------------------------------------- |
| `filename`       | `string`                                                                      |
| `contents`       | `string`                                                                      |
| `«destructured»` | [`Options`](/docs/core/api/modules/file/#options) & { `sentinel?`: `string` } |

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/file/src/index.ts:162](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L162)

## Type Aliases

### Options

**Options**: `Object`

Generic options for file functions

#### Type declaration

| Name    | Type                                   | Description                                                                                                            |
| :------ | :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `step?` | [`Step`](/docs/core/api/classes/Step/) | Avoid creating a new step in output for each function. Pass a Logger Step to pipe all logs and output to that instead. |

#### Defined in

[modules/file/src/index.ts:20](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts#L20)
