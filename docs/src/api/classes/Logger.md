---
title: 'API: classes/Logger'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Logger

# Class: Logger

## Constructors

### constructor

**new Logger**(`«destructured»`)

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Options` |

#### Defined in

[modules/logger/src/Logger.ts:32](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L32)

## Properties

### updater

**updater**: (...`text`: `string`[]) => `void` & `LogUpdateMethods`

#### Defined in

[modules/logger/src/Logger.ts:26](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L26)

## Accessors

### hasError

`get` **hasError**(): `boolean`

#### Returns

`boolean`

#### Defined in

[modules/logger/src/Logger.ts:58](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L58)

---

### verbosity

`get` **verbosity**(): `number`

#### Returns

`number`

#### Defined in

[modules/logger/src/Logger.ts:44](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L44)

`set` **verbosity**(`value`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:48](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L48)

## Methods

### createStep

**createStep**(`name`): [`Step`](/docs/core/api/classes/Step/)

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

[`Step`](/docs/core/api/classes/Step/)

#### Defined in

[modules/logger/src/Logger.ts:90](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L90)

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

[modules/logger/src/Logger.ts:109](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L109)

---

### end

**end**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/Logger.ts:117](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L117)

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

[modules/logger/src/Logger.ts:101](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L101)

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

[modules/logger/src/Logger.ts:97](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L97)

---

### pause

**pause**(): `void`

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:62](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L62)

---

### runUpdater

**runUpdater**(): `void`

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:73](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L73)

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

[modules/logger/src/Logger.ts:113](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L113)

---

### unpause

**unpause**(): `void`

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:68](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L68)

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

[modules/logger/src/Logger.ts:105](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L105)
