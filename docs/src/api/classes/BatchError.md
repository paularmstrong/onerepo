---
title: 'API: classes/BatchError'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / BatchError

# Class: BatchError

## Hierarchy

- `Error`

  ↳ **`BatchError`**

## Constructors

### constructor

**new BatchError**(`errors`, `options?`)

#### Parameters

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `errors`   | (`string` \| [`SubprocessError`](/docs/core/api/classes/SubprocessError/))[] |
| `options?` | `ErrorOptions`                                                               |

#### Overrides

Error.constructor

#### Defined in

[modules/subprocess/src/index.ts:291](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L291)

## Properties

### cause

`Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

---

### errors

**errors**: (`string` \| [`SubprocessError`](/docs/core/api/classes/SubprocessError/))[] = `[]`

#### Defined in

[modules/subprocess/src/index.ts:290](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L290)

---

### message

**message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

---

### name

**name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

---

### stack

`Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

---

### prepareStackTrace

`Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

(`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

`Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

`Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
