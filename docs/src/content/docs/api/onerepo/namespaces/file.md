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
<!-- @generated SignedSource<<cc008d6de5d1ffd5c8a15e706d6d24d9>> -->

## Type Aliases

### Options

```ts
type Options = {
	step?: LogStep;
};
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

#### Properties

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

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

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

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

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

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

##### sign?

```ts
optional sign: boolean;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

##### step?

```ts
optional step: LogStep;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)

## Functions

### chmod()

```ts
function chmod(filename, mode, options?): Promise<void>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)  
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
**Parameters:**

| Parameter  | Type                  |
| ---------- | --------------------- |
| `filename` | `string`              |
| `options?` | [`Options`](#options) |

**Returns:** `Promise`\<`null` \| `Stats`\>

---

### makeTempDir()

```ts
function makeTempDir(prefix, options?): Promise<string>;
```

**Defined in:** [modules/file/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/file/src/index.ts)  
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
**Parameters:**

| Parameter  | Type                                    |
| ---------- | --------------------------------------- |
| `filename` | `string`                                |
| `contents` | `string`                                |
| `options?` | [`WriteSafeOptions`](#writesafeoptions) |

**Returns:** `Promise`\<`void`\>

<!-- end-onerepo-sentinel -->
