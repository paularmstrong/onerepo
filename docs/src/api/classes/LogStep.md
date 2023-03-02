---
title: 'API: classes/LogStep'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / LogStep

# Class: LogStep

## Constructors

### constructor

**new LogStep**(`name`, `«destructured»`)

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `name`           | `string`      |
| `«destructured»` | `StepOptions` |

#### Defined in

[modules/logger/src/LogStep.ts:28](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L28)

## Properties

### hasError

**hasError**: `boolean` = `false`

Whether or not this step has logged an error.

#### Defined in

[modules/logger/src/LogStep.ts:26](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L26)

## Accessors

### active

`get` **active**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/logger/src/LogStep.ts:44](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L44)

---

### name

`get` **name**(): `string`

#### Returns

`string`

#### Defined in

[modules/logger/src/LogStep.ts:40](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L40)

---

### status

`get` **status**(): `string`[]

While buffering logs, returns the status line and last 3 lines of buffered output.

#### Returns

`string`[]

#### Defined in

[modules/logger/src/LogStep.ts:51](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L51)

---

### verbosity

`get` **verbosity**(): `number`

#### Returns

`number`

#### Defined in

[modules/logger/src/LogStep.ts:60](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L60)

`set` **verbosity**(`verbosity`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `verbosity` | `number` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:55](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L55)

## Methods

### activate

**activate**(`enableWrite?`): `void`

Activate a step. This is typically only called from within the root `Logger` instance and should not be done manually.

#### Parameters

| Name          | Type      | Default value           |
| :------------ | :-------- | :---------------------- |
| `enableWrite` | `boolean` | `!process.stderr.isTTY` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:67](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L67)

---

### debug

**debug**(`contents`): `void`

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:150](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L150)

---

### end

**end**(): `Promise`<`void`\>

Finish this step and flush all buffered logs.

```ts
await step.end();
```

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/LogStep.ts:94](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L94)

---

### error

**error**(`contents`): `void`

Log an error. This will cause the root logger to include an error and fail a command

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:127](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L127)

---

### flush

**flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/LogStep.ts:109](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L109)

---

### log

**log**(`contents`): `void`

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:143](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L143)

---

### timing

**timing**(`start`, `end`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `start` | `string` |
| `end`   | `string` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:157](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L157)

---

### warn

**warn**(`contents`): `void`

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/LogStep.ts:136](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts#L136)
