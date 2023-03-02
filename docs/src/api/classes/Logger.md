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

The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.

All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.

You should not need to construct instances of the `Logger` directly, but instead import a singleton instead:

If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.

```ts
import { logger } from 'onerepo';
```

## Constructors

### constructor

**new Logger**(`options`)

#### Parameters

| Name      | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `options` | [`LoggerOptions`](/docs/core/api/interfaces/LoggerOptions/) |

#### Defined in

[modules/logger/src/Logger.ts:48](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L48)

## Accessors

### hasError

`get` **hasError**(): `boolean`

Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.

#### Returns

`boolean`

#### Defined in

[modules/logger/src/Logger.ts:80](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L80)

---

### verbosity

`get` **verbosity**(): `number`

#### Returns

`number`

#### Defined in

[modules/logger/src/Logger.ts:60](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L60)

`set` **verbosity**(`value`): `void`

Recursively applies the new verbosity to the logger and all of its active steps.

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:67](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L67)

## Methods

### createStep

**createStep**(`name`): [`LogStep`](/docs/core/api/classes/LogStep/)

Create a sub-step, [`LogStep`](/docs/core/api/classes/LogStep/), for the logger. This and any other step will be tracked and required to finish before exit.

```ts
const step = logger.createStep('Do fun stuff');
// do some work
await step.end();
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

[`LogStep`](/docs/core/api/classes/LogStep/)

#### Defined in

[modules/logger/src/Logger.ts:135](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L135)

---

### debug

**debug**(`contents`): `void`

This is a pass-through for the main step’s [`debug()` method](/docs/core/api/classes/LogStep/#debug).

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:166](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L166)

---

### end

**end**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[modules/logger/src/Logger.ts:177](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L177)

---

### error

**error**(`contents`): `void`

This is a pass-through for the main step’s [`error()` method](/docs/core/api/classes/LogStep/#error).

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:152](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L152)

---

### log

**log**(`contents`): `void`

This is a pass-through for the main step’s [`log()` method](/docs/core/api/classes/LogStep/#log).

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:145](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L145)

---

### pause

**pause**(): `void`

When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and [`unpause()`](#unpause) when complete.

This process is also automated by the [`run()`](/docs/core/api/public/#run) function when `stdio` is set to `pipe`.

```ts
logger.pause();
// capture input
logger.unpause();
```

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:95](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L95)

---

### timing

**timing**(`start`, `end`): `void`

This is a pass-through for the main step’s [`timing()` method](/docs/core/api/classes/LogStep/#timing).

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `start` | `string` |
| `end`   | `string` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:173](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L173)

---

### unpause

**unpause**(): `void`

See [`pause`](#pause) for more information.

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:104](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L104)

---

### warn

**warn**(`contents`): `void`

This is a pass-through for the main step’s [`warn()` method](/docs/core/api/classes/LogStep/#warn).

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

#### Returns

`void`

#### Defined in

[modules/logger/src/Logger.ts:159](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L159)
