---
title: 'API: classes/Step'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Step

# Class: Step

## Constructors

### constructor

**new Step**(`name`, `«destructured»`)

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `name`           | `string`      |
| `«destructured»` | `StepOptions` |

#### Defined in

[modules/logger/src/Step.ts:21](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L21)

## Properties

### hasError

**hasError**: `boolean` = `false`

#### Defined in

[modules/logger/src/Step.ts:19](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L19)

---

### stream

**stream**: `Duplex`

#### Defined in

[modules/logger/src/Step.ts:14](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L14)

## Accessors

### active

`get` **active**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/logger/src/Step.ts:41](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L41)

`set` **active**(`value`): `void`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Step.ts:45](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L45)

---

### name

`get` **name**(): `string`

#### Returns

`string`

#### Defined in

[modules/logger/src/Step.ts:33](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L33)

`set` **name**(`name`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Step.ts:37](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L37)

---

### status

`get` **status**(): `string`[]

#### Returns

`string`[]

#### Defined in

[modules/logger/src/Step.ts:49](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L49)

---

### verbosity

`get` **verbosity**(): `number`

#### Returns

`number`

#### Defined in

[modules/logger/src/Step.ts:58](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L58)

`set` **verbosity**(`verbosity`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `verbosity` | `number` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Step.ts:53](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L53)

## Methods

### activate

**activate**(`enableWrite?`): `void`

#### Parameters

| Name          | Type      | Default value           |
| :------------ | :-------- | :---------------------- |
| `enableWrite` | `boolean` | `!process.stderr.isTTY` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Step.ts:62](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L62)

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

[modules/logger/src/Step.ts:135](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L135)

---

### end

**end**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/Step.ts:82](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L82)

---

### error

**error**(`contents`): `void`

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Step.ts:112](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L112)

---

### flush

**flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/Step.ts:97](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L97)

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

[modules/logger/src/Step.ts:128](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L128)

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

[modules/logger/src/Step.ts:142](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L142)

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

[modules/logger/src/Step.ts:121](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Step.ts#L121)
