---
title: oneRepo API
description: Full API documentation for oneRepo.
---

<!-- start-onerepo-sentinel -->
<!-- @generated SignedSource<<163fb285e61711e377f2aef07b6619c3>> -->

## Namespaces

| Namespace                        | Description                                                                                   |
| :------------------------------- | :-------------------------------------------------------------------------------------------- |
| [builders](namespaces/builders/) | Common and reusable command-line option builders.                                             |
| [file](namespaces/file/)         | File manipulation functions.                                                                  |
| [git](namespaces/git/)           | Special handlers for managing complex queries and manipulation of the git repository's state. |

## Classes

### LogStep

#### Extends

- `Duplex`

#### Constructors

##### new LogStep(\_\_namedParameters)

```ts
new LogStep(__namedParameters): LogStep
```

**Parameters:**

| Parameter           | Type                                |
| :------------------ | :---------------------------------- |
| `__namedParameters` | [`LogStepOptions`](#logstepoptions) |

**Returns:** [`LogStep`](#logstep)

###### Overrides

`Duplex.constructor`

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Properties

| Property                 | Modifier   | Flags                                        | Type                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Inherited from                  |
| :----------------------- | :--------- | :------------------------------------------- | :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `allowHalfOpen`          | `public`   |                                              | `boolean`                         | If `false` then the stream will automatically end the writable side when the<br />readable side ends. Set initially by the `allowHalfOpen` constructor option,<br />which defaults to `true`.<br /><br />This can be changed manually to change the half-open behavior of an existing`Duplex` stream instance, but must be changed before the `'end'` event is<br />emitted.<br /><br />**Since**<br />v0.9.4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Duplex.allowHalfOpen`          |
| `captureRejectionSymbol` | `readonly` |                                              | _typeof_ `captureRejectionSymbol` | Value: `Symbol.for('nodejs.rejection')`<br /><br />See how to write a custom `rejection handler`.<br /><br />**Since**<br />v13.4.0, v12.16.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Duplex.captureRejectionSymbol` |
| `captureRejections`      | `static`   |                                              | `boolean`                         | Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)<br /><br />Change the default `captureRejections` option on all new `EventEmitter` objects.<br /><br />**Since**<br />v13.4.0, v12.16.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Duplex.captureRejections`      |
| `closed`                 | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.closed`                 |
| `defaultMaxListeners`    | `static`   |                                              | `number`                          | By default, a maximum of `10` listeners can be registered for any single<br />event. This limit can be changed for individual `EventEmitter` instances<br />using the `emitter.setMaxListeners(n)` method. To change the default<br />for _all_`EventEmitter` instances, the `events.defaultMaxListeners`property can be used. If this value is not a positive number, a `RangeError`is thrown.<br /><br />Take caution when setting the `events.defaultMaxListeners` because the<br />change affects _all_`EventEmitter` instances, including those created before<br />the change is made. However, calling `emitter.setMaxListeners(n)` still has<br />precedence over `events.defaultMaxListeners`.<br /><br />This is not a hard limit. The `EventEmitter` instance will allow<br />more listeners to be added but will output a trace warning to stderr indicating<br />that a "possible EventEmitter memory leak" has been detected. For any single`EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()`methods can be used to<br />temporarily avoid this warning:<br /><br />`js import { EventEmitter } from 'node:events'; const emitter = new EventEmitter(); emitter.setMaxListeners(emitter.getMaxListeners() + 1); emitter.once('event', () => {   // do stuff   emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0)); }); `<br /><br />The `--trace-warnings` command-line flag can be used to display the<br />stack trace for such warnings.<br /><br />The emitted warning can be inspected with `process.on('warning')` and will<br />have the additional `emitter`, `type`, and `count` properties, referring to<br />the event emitter instance, the event's name and the number of attached<br />listeners, respectively.<br />Its `name` property is set to `'MaxListenersExceededWarning'`.<br /><br />**Since**<br />v0.11.2 | `Duplex.defaultMaxListeners`    |
| `destroyed`              | `public`   |                                              | `boolean`                         | Is `true` after `readable.destroy()` has been called.<br /><br />**Since**<br />v8.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `Duplex.destroyed`              |
| `errorMonitor`           | `readonly` |                                              | _typeof_ `errorMonitor`           | This symbol shall be used to install a listener for only monitoring `'error'`events. Listeners installed using this symbol are called before the regular`'error'` listeners are called.<br /><br />Installing a listener using this symbol does not change the behavior once an`'error'` event is emitted. Therefore, the process will still crash if no<br />regular `'error'` listener is installed.<br /><br />**Since**<br />v13.6.0, v12.17.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `Duplex.errorMonitor`           |
| `errored`                | `readonly` |                                              | `null` \| `Error`                 | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.errored`                |
| `isPiped`                | `public`   |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | -                               |
| `name?`                  | `public`   |                                              | `string`                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | -                               |
| `readable`               | `public`   |                                              | `boolean`                         | Is `true` if it is safe to call `readable.read()`, which means<br />the stream has not been destroyed or emitted `'error'` or `'end'`.<br /><br />**Since**<br />v11.4.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Duplex.readable`               |
| `readableAborted`        | `readonly` | <span class="tag danger">Experimental</span> | `boolean`                         | Returns whether the stream was destroyed or errored before emitting `'end'`.<br /><br />**Since**<br />v16.8.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Duplex.readableAborted`        |
| `readableDidRead`        | `readonly` | <span class="tag danger">Experimental</span> | `boolean`                         | Returns whether `'data'` has been emitted.<br /><br />**Since**<br />v16.7.0, v14.18.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `Duplex.readableDidRead`        |
| `readableEncoding`       | `readonly` |                                              | `null` \| `BufferEncoding`        | Getter for the property `encoding` of a given `Readable` stream. The `encoding`property can be set using the `readable.setEncoding()` method.<br /><br />**Since**<br />v12.7.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Duplex.readableEncoding`       |
| `readableEnded`          | `readonly` |                                              | `boolean`                         | Becomes `true` when `'end'` event is emitted.<br /><br />**Since**<br />v12.9.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Duplex.readableEnded`          |
| `readableFlowing`        | `readonly` |                                              | `null` \| `boolean`               | This property reflects the current state of a `Readable` stream as described<br />in the `Three states` section.<br /><br />**Since**<br />v9.4.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.readableFlowing`        |
| `readableHighWaterMark`  | `readonly` |                                              | `number`                          | Returns the value of `highWaterMark` passed when creating this `Readable`.<br /><br />**Since**<br />v9.3.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Duplex.readableHighWaterMark`  |
| `readableLength`         | `readonly` |                                              | `number`                          | This property contains the number of bytes (or objects) in the queue<br />ready to be read. The value provides introspection data regarding<br />the status of the `highWaterMark`.<br /><br />**Since**<br />v9.4.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `Duplex.readableLength`         |
| `readableObjectMode`     | `readonly` |                                              | `boolean`                         | Getter for the property `objectMode` of a given `Readable` stream.<br /><br />**Since**<br />v12.3.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `Duplex.readableObjectMode`     |
| `writable`               | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writable`               |
| `writableCorked`         | `readonly` |                                              | `number`                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableCorked`         |
| `writableEnded`          | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableEnded`          |
| `writableFinished`       | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableFinished`       |
| `writableHighWaterMark`  | `readonly` |                                              | `number`                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableHighWaterMark`  |
| `writableLength`         | `readonly` |                                              | `number`                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableLength`         |
| `writableNeedDrain`      | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableNeedDrain`      |
| `writableObjectMode`     | `readonly` |                                              | `boolean`                         | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Duplex.writableObjectMode`     |

#### Accessors

##### hasError

```ts
get hasError(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasInfo

```ts
get hasInfo(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasLog

```ts
get hasLog(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### hasWarning

```ts
get hasWarning(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### verbosity

```ts
set verbosity(verbosity): void
```

**Parameters:**

| Parameter   | Type                        |
| :---------- | :-------------------------- |
| `verbosity` | [`Verbosity`](#verbosity-2) |

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

#### Methods

##### `[asyncDispose]`()

```ts
asyncDispose: Promise<void>;
```

Calls `readable.destroy()` with an `AbortError` and returns a promise that fulfills when the stream is finished.

**Returns:** `Promise`\<`void`\>

###### Inherited from

`Duplex.[asyncDispose]`

###### Since

v20.4.0

**Source:** node_modules/@types/node/stream.d.ts:651

##### `[asyncIterator]`()

```ts
asyncIterator: AsyncIterableIterator<any>;
```

**Returns:** `AsyncIterableIterator`\<`any`\>

###### Inherited from

`Duplex.[asyncIterator]`

**Source:** node_modules/@types/node/stream.d.ts:646

##### `[captureRejectionSymbol]`()?

```ts
optional [captureRejectionSymbol](
   error,
   event, ...
   args): void
```

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `error`   | `Error`  |
| `event`   | `string` |
| ...`args` | `any`[]  |

**Returns:** `void`

###### Inherited from

`Duplex.[captureRejectionSymbol]`

**Source:** node_modules/@types/node/events.d.ts:112

##### \_construct()?

```ts
optional _construct(callback): void
```

**Parameters:**

| Parameter  | Type                 |
| :--------- | :------------------- |
| `callback` | (`error`?) => `void` |

**Returns:** `void`

###### Inherited from

`Duplex._construct`

**Source:** node_modules/@types/node/stream.d.ts:126

##### \_destroy()

```ts
_destroy(error, callback): void
```

**Parameters:**

| Parameter  | Type                 |
| :--------- | :------------------- |
| `error`    | `null` \| `Error`    |
| `callback` | (`error`?) => `void` |

**Returns:** `void`

###### Inherited from

`Duplex._destroy`

**Source:** node_modules/@types/node/stream.d.ts:1111

##### \_final()

```ts
_final(callback): void
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `callback` | () => `void` |

**Returns:** `void`

###### Overrides

`Duplex._final`

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### \_read()

```ts
_read(): void
```

**Returns:** `void`

###### Overrides

`Duplex._read`

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### \_write()

```ts
_write(
   chunk,
   encoding,
   callback): void
```

**Parameters:**

| Parameter  | Type                    |
| :--------- | :---------------------- |
| `chunk`    | `string` \| `Buffer`    |
| `encoding` | `undefined` \| `string` |
| `callback` | () => `void`            |

**Returns:** `void`

###### Overrides

`Duplex._write`

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### \_writev()?

```ts
optional _writev(chunks, callback): void
```

**Parameters:**

| Parameter  | Type                                                 |
| :--------- | :--------------------------------------------------- |
| `chunks`   | \{ `chunk`: `any`; `encoding`: `BufferEncoding`; }[] |
| `callback` | (`error`?) => `void`                                 |

**Returns:** `void`

###### Inherited from

`Duplex._writev`

**Source:** node_modules/@types/node/stream.d.ts:1104

##### addAbortListener()

<span class="tag danger">Experimental</span>

```ts
static addAbortListener(signal, resource): Disposable
```

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
	let disposable;
	try {
		signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
		disposable = addAbortListener(signal, (e) => {
			// Do something when signal is aborted.
		});
	} finally {
		disposable?.[Symbol.dispose]();
	}
}
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `signal`   | `AbortSignal`       |
| `resource` | (`event`) => `void` |

**Returns:** `Disposable`

Disposable that removes the `abort` listener.

###### Inherited from

`Duplex.addAbortListener`

###### Since

v20.5.0

**Source:** node_modules/@types/node/events.d.ts:387

##### addListener()

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

Event emitter
The defined events on documents including:

1.  close
2.  data
3.  drain
4.  end
5.  error
6.  finish
7.  pause
8.  pipe
9.  readable
10. resume
11. unpipe

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1160

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1161

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1162

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1163

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1164

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1165

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1166

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1167

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1168

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1169

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1170

###### addListener(event, listener)

```ts
addListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.addListener`

**Source:** node_modules/@types/node/stream.d.ts:1171

##### asIndexedPairs()

```ts
asIndexedPairs(options?): Readable
```

This method returns a new stream with chunks of the underlying stream paired with a counter
in the form `[index, chunk]`. The first index value is `0` and it increases by 1 for each chunk produced.

**Parameters:**

| Parameter  | Type                                 |
| :--------- | :----------------------------------- |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\> |

**Returns:** `Readable`

a stream of indexed pairs.

###### Inherited from

`Duplex.asIndexedPairs`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:541

##### compose()

```ts
compose<T>(stream, options?): T
```

**Type parameters:**

| Type parameter               |
| :--------------------------- |
| `T` extends `ReadableStream` |

**Parameters:**

| Parameter         | Type                                                                   |
| :---------------- | :--------------------------------------------------------------------- |
| `stream`          | `T` \| `ComposeFnParam` \| `Iterable`\<`T`\> \| `AsyncIterable`\<`T`\> |
| `options`?        | `Object`                                                               |
| `options.signal`? | `AbortSignal`                                                          |

**Returns:** `T`

###### Inherited from

`Duplex.compose`

**Source:** node_modules/@types/node/stream.d.ts:35

##### cork()

```ts
cork(): void
```

**Returns:** `void`

###### Inherited from

`Duplex.cork`

**Source:** node_modules/@types/node/stream.d.ts:1119

##### debug()

```ts
debug(contents): void
```

**Parameters:**

| Parameter  | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### destroy()

```ts
destroy(error?): this
```

Destroy the stream. Optionally emit an `'error'` event, and emit a `'close'`event (unless `emitClose` is set to `false`). After this call, the readable
stream will release any internal resources and subsequent calls to `push()`will be ignored.

Once `destroy()` has been called any further calls will be a no-op and no
further errors except from `_destroy()` may be emitted as `'error'`.

Implementors should not override this method, but instead implement `readable._destroy()`.

**Parameters:**

| Parameter | Type    | Description                                              |
| :-------- | :------ | :------------------------------------------------------- |
| `error`?  | `Error` | Error which will be passed as payload in `'error'` event |

**Returns:** `this`

###### Inherited from

`Duplex.destroy`

###### Since

v8.0.0

**Source:** node_modules/@types/node/stream.d.ts:578

##### drop()

```ts
drop(limit, options?): Readable
```

This method returns a new stream with the first _limit_ chunks dropped from the start.

**Parameters:**

| Parameter  | Type                                 | Description                                     |
| :--------- | :----------------------------------- | :---------------------------------------------- |
| `limit`    | `number`                             | the number of chunks to drop from the readable. |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\> | -                                               |

**Returns:** `Readable`

a stream with _limit_ chunks dropped from the start.

###### Inherited from

`Duplex.drop`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:527

##### emit()

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type      |
| :-------- | :-------- |
| `event`   | `"close"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1172

###### emit(event, chunk)

```ts
emit(event, chunk): boolean
```

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `event`   | `"data"` |
| `chunk`   | `any`    |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1173

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type      |
| :-------- | :-------- |
| `event`   | `"drain"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1174

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type    |
| :-------- | :------ |
| `event`   | `"end"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1175

###### emit(event, err)

```ts
emit(event, err): boolean
```

**Parameters:**

| Parameter | Type      |
| :-------- | :-------- |
| `event`   | `"error"` |
| `err`     | `Error`   |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1176

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type       |
| :-------- | :--------- |
| `event`   | `"finish"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1177

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type      |
| :-------- | :-------- |
| `event`   | `"pause"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1178

###### emit(event, src)

```ts
emit(event, src): boolean
```

**Parameters:**

| Parameter | Type       |
| :-------- | :--------- |
| `event`   | `"pipe"`   |
| `src`     | `Readable` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1179

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type         |
| :-------- | :----------- |
| `event`   | `"readable"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1180

###### emit(event)

```ts
emit(event): boolean
```

**Parameters:**

| Parameter | Type       |
| :-------- | :--------- |
| `event`   | `"resume"` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1181

###### emit(event, src)

```ts
emit(event, src): boolean
```

**Parameters:**

| Parameter | Type       |
| :-------- | :--------- |
| `event`   | `"unpipe"` |
| `src`     | `Readable` |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1182

###### emit(event, args)

```ts
emit(event, ...args): boolean
```

**Parameters:**

| Parameter | Type                 |
| :-------- | :------------------- |
| `event`   | `string` \| `symbol` |
| ...`args` | `any`[]              |

**Returns:** `boolean`

###### Inherited from

`Duplex.emit`

**Source:** node_modules/@types/node/stream.d.ts:1183

##### end()

```ts
end(): this
```

**Returns:** `this`

###### Overrides

`Duplex.end`

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### error()

```ts
error(contents): void
```

**Parameters:**

| Parameter  | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### eventNames()

```ts
eventNames(): (string | symbol)[]
```

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

**Returns:** (`string` \| `symbol`)[]

###### Inherited from

`Duplex.eventNames`

###### Since

v6.0.0

**Source:** node_modules/@types/node/events.d.ts:870

##### every()

```ts
every(fn, options?): Promise<boolean>
```

This method is similar to `Array.prototype.every` and calls _fn_ on each chunk in the stream
to check if all awaited return values are truthy value for _fn_. Once an _fn_ call on a chunk
`await`ed return value is falsy, the stream is destroyed and the promise is fulfilled with `false`.
If all of the _fn_ calls on the chunks return a truthy value, the promise is fulfilled with `true`.

**Parameters:**

| Parameter  | Type                                                        | Description                                                   |
| :--------- | :---------------------------------------------------------- | :------------------------------------------------------------ |
| `fn`       | (`data`, `options`?) => `boolean` \| `Promise`\<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options`? | `ArrayOptions`                                              | -                                                             |

**Returns:** `Promise`\<`boolean`\>

a promise evaluating to `true` if _fn_ returned a truthy value for every one of the chunks.

###### Inherited from

`Duplex.every`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:506

##### filter()

```ts
filter(fn, options?): Readable
```

This method allows filtering the stream. For each chunk in the stream the _fn_ function will be called
and if it returns a truthy value, the chunk will be passed to the result stream.
If the _fn_ function returns a promise - that promise will be `await`ed.

**Parameters:**

| Parameter  | Type                                                        | Description                                                |
| :--------- | :---------------------------------------------------------- | :--------------------------------------------------------- |
| `fn`       | (`data`, `options`?) => `boolean` \| `Promise`\<`boolean`\> | a function to filter chunks from the stream. Async or not. |
| `options`? | `ArrayOptions`                                              | -                                                          |

**Returns:** `Readable`

a stream filtered with the predicate _fn_.

###### Inherited from

`Duplex.filter`

###### Since

v17.4.0, v16.14.0

**Source:** node_modules/@types/node/stream.d.ts:434

##### find()

###### find(fn, options)

```ts
find<T>(fn, options?): Promise<undefined | T>
```

This method is similar to `Array.prototype.find` and calls _fn_ on each chunk in the stream
to find a chunk with a truthy value for _fn_. Once an _fn_ call's awaited return value is truthy,
the stream is destroyed and the promise is fulfilled with value for which _fn_ returned a truthy value.
If all of the _fn_ calls on the chunks return a falsy value, the promise is fulfilled with `undefined`.

**Type parameters:**

| Type parameter |
| :------------- |
| `T`            |

**Parameters:**

| Parameter  | Type                                | Description                                                   |
| :--------- | :---------------------------------- | :------------------------------------------------------------ |
| `fn`       | (`data`, `options`?) => `data is T` | a function to call on each chunk of the stream. Async or not. |
| `options`? | `ArrayOptions`                      | -                                                             |

**Returns:** `Promise`\<`undefined` \| `T`\>

a promise evaluating to the first chunk for which _fn_ evaluated with a truthy value,
or `undefined` if no element was found.

###### Inherited from

`Duplex.find`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:489

###### find(fn, options)

```ts
find(fn, options?): Promise<any>
```

**Parameters:**

| Parameter  | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `fn`       | (`data`, `options`?) => `boolean` \| `Promise`\<`boolean`\> |
| `options`? | `ArrayOptions`                                              |

**Returns:** `Promise`\<`any`\>

###### Inherited from

`Duplex.find`

**Source:** node_modules/@types/node/stream.d.ts:493

##### flatMap()

```ts
flatMap(fn, options?): Readable
```

This method returns a new stream by applying the given callback to each chunk of the stream
and then flattening the result.

It is possible to return a stream or another iterable or async iterable from _fn_ and the result streams
will be merged (flattened) into the returned stream.

**Parameters:**

| Parameter  | Type                          | Description                                                                                   |
| :--------- | :---------------------------- | :-------------------------------------------------------------------------------------------- |
| `fn`       | (`data`, `options`?) => `any` | a function to map over every chunk in the stream. May be async. May be a stream or generator. |
| `options`? | `ArrayOptions`                | -                                                                                             |

**Returns:** `Readable`

a stream flat-mapped with the function _fn_.

###### Inherited from

`Duplex.flatMap`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:520

##### forEach()

```ts
forEach(fn, options?): Promise<void>
```

This method allows iterating a stream. For each chunk in the stream the _fn_ function will be called.
If the _fn_ function returns a promise - that promise will be `await`ed.

This method is different from `for await...of` loops in that it can optionally process chunks concurrently.
In addition, a `forEach` iteration can only be stopped by having passed a `signal` option
and aborting the related AbortController while `for await...of` can be stopped with `break` or `return`.
In either case the stream will be destroyed.

This method is different from listening to the `'data'` event in that it uses the `readable` event
in the underlying machinary and can limit the number of concurrent _fn_ calls.

**Parameters:**

| Parameter  | Type                                                  | Description                                                   |
| :--------- | :---------------------------------------------------- | :------------------------------------------------------------ |
| `fn`       | (`data`, `options`?) => `void` \| `Promise`\<`void`\> | a function to call on each chunk of the stream. Async or not. |
| `options`? | `ArrayOptions`                                        | -                                                             |

**Returns:** `Promise`\<`void`\>

a promise for when the stream has finished.

###### Inherited from

`Duplex.forEach`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:453

##### from()

```ts
static from(src): Duplex
```

A utility method for creating duplex streams.

- `Stream` converts writable stream into writable `Duplex` and readable stream
  to `Duplex`.
- `Blob` converts into readable `Duplex`.
- `string` converts into readable `Duplex`.
- `ArrayBuffer` converts into readable `Duplex`.
- `AsyncIterable` converts into a readable `Duplex`. Cannot yield `null`.
- `AsyncGeneratorFunction` converts into a readable/writable transform
  `Duplex`. Must take a source `AsyncIterable` as first parameter. Cannot yield
  `null`.
- `AsyncFunction` converts into a writable `Duplex`. Must return
  either `null` or `undefined`
- `Object ({ writable, readable })` converts `readable` and
  `writable` into `Stream` and then combines them into `Duplex` where the
  `Duplex` will write to the `writable` and read from the `readable`.
- `Promise` converts into readable `Duplex`. Value `null` is ignored.

**Parameters:**

| Parameter | Type                                                                                                                                                                |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src`     | \| `string` \| `Object` \| `Promise`\<`any`\> \| `Stream` \| `ArrayBuffer` \| `Iterable`\<`any`\> \| `Blob` \| `AsyncIterable`\<`any`\> \| `AsyncGeneratorFunction` |

**Returns:** `Duplex`

###### Inherited from

`Duplex.from`

###### Since

v16.8.0

**Source:** node_modules/@types/node/stream.d.ts:1091

##### fromWeb()

<span class="tag danger">Experimental</span>

```ts
static fromWeb(duplexStream, options?): Duplex
```

A utility method for creating a `Duplex` from a web `ReadableStream` and `WritableStream`.

**Parameters:**

| Parameter                | Type                                                                                                                                      |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `duplexStream`           | `Object`                                                                                                                                  |
| `duplexStream.readable`  | `ReadableStream`\<`any`\>                                                                                                                 |
| `duplexStream.writable`? | `WritableStream`\<`any`\>                                                                                                                 |
| `options`?               | `Pick`\<`DuplexOptions`, \| `"allowHalfOpen"` \| `"decodeStrings"` \| `"encoding"` \| `"highWaterMark"` \| `"objectMode"` \| `"signal"`\> |

**Returns:** `Duplex`

###### Inherited from

`Duplex.fromWeb`

###### Since

v17.0.0

**Source:** node_modules/@types/node/stream.d.ts:1135

##### getEventListeners()

```ts
static getEventListeners(emitter, name): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
	const ee = new EventEmitter();
	const listener = () => console.log('Events are fun');
	ee.on('foo', listener);
	console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
	const et = new EventTarget();
	const listener = () => console.log('Events are fun');
	et.addEventListener('foo', listener);
	console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

**Parameters:**

| Parameter | Type                                |
| :-------- | :---------------------------------- |
| `emitter` | `EventEmitter` \| `_DOMEventTarget` |
| `name`    | `string` \| `symbol`                |

**Returns:** `Function`[]

###### Inherited from

`Duplex.getEventListeners`

###### Since

v15.2.0, v14.17.0

**Source:** node_modules/@types/node/events.d.ts:308

##### getMaxListeners()

```ts
static getMaxListeners(emitter): number
```

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
	const ee = new EventEmitter();
	console.log(getMaxListeners(ee)); // 10
	setMaxListeners(11, ee);
	console.log(getMaxListeners(ee)); // 11
}
{
	const et = new EventTarget();
	console.log(getMaxListeners(et)); // 10
	setMaxListeners(11, et);
	console.log(getMaxListeners(et)); // 11
}
```

**Parameters:**

| Parameter | Type                                |
| :-------- | :---------------------------------- |
| `emitter` | `EventEmitter` \| `_DOMEventTarget` |

**Returns:** `number`

###### Inherited from

`Duplex.getMaxListeners`

###### Since

v19.9.0

**Source:** node_modules/@types/node/events.d.ts:337

##### getMaxListeners()

```ts
getMaxListeners(): number
```

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](#logstep).

**Returns:** `number`

###### Inherited from

`Duplex.getMaxListeners`

###### Since

v1.0.0

**Source:** node_modules/@types/node/events.d.ts:722

##### info()

```ts
info(contents): void
```

**Parameters:**

| Parameter  | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### isDisturbed()

```ts
static isDisturbed(stream): boolean
```

Returns whether the stream has been read from or cancelled.

**Parameters:**

| Parameter | Type                           |
| :-------- | :----------------------------- |
| `stream`  | `Readable` \| `ReadableStream` |

**Returns:** `boolean`

###### Inherited from

`Duplex.isDisturbed`

###### Since

v16.8.0

**Source:** node_modules/@types/node/stream.d.ts:58

##### isPaused()

```ts
isPaused(): boolean
```

The `readable.isPaused()` method returns the current operating state of the`Readable`. This is used primarily by the mechanism that underlies the`readable.pipe()` method. In most
typical cases, there will be no reason to
use this method directly.

```js
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

**Returns:** `boolean`

###### Inherited from

`Duplex.isPaused`

###### Since

v0.11.14

**Source:** node_modules/@types/node/stream.d.ts:287

##### iterator()

```ts
iterator(options?): AsyncIterableIterator<any>
```

The iterator created by this method gives users the option to cancel the destruction
of the stream if the `for await...of` loop is exited by `return`, `break`, or `throw`,
or if the iterator should destroy the stream if the stream emitted an error during iteration.

**Parameters:**

| Parameter                  | Type      | Description                                                                                                                                                                                            |
| :------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`?                 | `Object`  | -                                                                                                                                                                                                      |
| `options.destroyOnReturn`? | `boolean` | When set to `false`, calling `return` on the async iterator,<br />or exiting a `for await...of` iteration using a `break`, `return`, or `throw` will not destroy the stream.<br />**Default: `true`**. |

**Returns:** `AsyncIterableIterator`\<`any`\>

###### Inherited from

`Duplex.iterator`

###### Since

v16.3.0

**Source:** node_modules/@types/node/stream.d.ts:417

##### ~~listenerCount()~~

```ts
static listenerCount(emitter, eventName): number
```

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

**Parameters:**

| Parameter   | Type                 | Description          |
| :---------- | :------------------- | :------------------- |
| `emitter`   | `EventEmitter`       | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name       |

**Returns:** `number`

###### Inherited from

`Duplex.listenerCount`

###### Since

v0.9.12

###### Deprecated

Since v3.2.0 - Use `listenerCount` instead.

**Source:** node_modules/@types/node/events.d.ts:280

##### listenerCount()

```ts
listenerCount(eventName, listener?): number
```

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

**Parameters:**

| Parameter   | Type                 | Description                              |
| :---------- | :------------------- | :--------------------------------------- |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener`? | `Function`           | The event handler function               |

**Returns:** `number`

###### Inherited from

`Duplex.listenerCount`

###### Since

v3.2.0

**Source:** node_modules/@types/node/events.d.ts:816

##### listeners()

```ts
listeners(eventName): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
	console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

**Parameters:**

| Parameter   | Type                 |
| :---------- | :------------------- |
| `eventName` | `string` \| `symbol` |

**Returns:** `Function`[]

###### Inherited from

`Duplex.listeners`

###### Since

v0.1.26

**Source:** node_modules/@types/node/events.d.ts:735

##### log()

```ts
log(contents): void
```

**Parameters:**

| Parameter  | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### map()

```ts
map(fn, options?): Readable
```

This method allows mapping over the stream. The _fn_ function will be called for every chunk in the stream.
If the _fn_ function returns a promise - that promise will be `await`ed before being passed to the result stream.

**Parameters:**

| Parameter  | Type                          | Description                                                     |
| :--------- | :---------------------------- | :-------------------------------------------------------------- |
| `fn`       | (`data`, `options`?) => `any` | a function to map over every chunk in the stream. Async or not. |
| `options`? | `ArrayOptions`                | -                                                               |

**Returns:** `Readable`

a stream mapped with the function _fn_.

###### Inherited from

`Duplex.map`

###### Since

v17.4.0, v16.14.0

**Source:** node_modules/@types/node/stream.d.ts:425

##### off()

```ts
off(eventName, listener): this
```

Alias for `emitter.removeListener()`.

**Parameters:**

| Parameter   | Type                  |
| :---------- | :-------------------- |
| `eventName` | `string` \| `symbol`  |
| `listener`  | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.off`

###### Since

v10.0.0

**Source:** node_modules/@types/node/events.d.ts:695

##### on()

```ts
static on(
   emitter,
   eventName,
options?): AsyncIterableIterator<any>
```

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
	ee.emit('foo', 'bar');
	ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
	// The execution of this inner block is synchronous and it
	// processes one event at a time (even with await). Do not use
	// if concurrent execution is required.
	console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
	const ee = new EventEmitter();

	// Emit later on
	process.nextTick(() => {
		ee.emit('foo', 'bar');
		ee.emit('foo', 42);
	});

	for await (const event of on(ee, 'foo', { signal: ac.signal })) {
		// The execution of this inner block is synchronous and it
		// processes one event at a time (even with await). Do not use
		// if concurrent execution is required.
		console.log(event); // prints ['bar'] [42]
	}
	// Unreachable here
})();

process.nextTick(() => ac.abort());
```

**Parameters:**

| Parameter   | Type                        | Description                              |
| :---------- | :-------------------------- | :--------------------------------------- |
| `emitter`   | `EventEmitter`              | -                                        |
| `eventName` | `string`                    | The name of the event being listened for |
| `options`?  | `StaticEventEmitterOptions` | -                                        |

**Returns:** `AsyncIterableIterator`\<`any`\>

that iterates `eventName` events emitted by the `emitter`

###### Inherited from

`Duplex.on`

###### Since

v13.6.0, v12.16.0

**Source:** node_modules/@types/node/events.d.ts:258

##### on()

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1184

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1185

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1186

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1187

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1188

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1189

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1190

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1191

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1192

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1193

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1194

###### on(event, listener)

```ts
on(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.on`

**Source:** node_modules/@types/node/stream.d.ts:1195

##### once()

###### once(emitter, eventName, options)

```ts
static once(
   emitter,
   eventName,
options?): Promise<any[]>
```

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
	ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
	ee.emit('error', err);
});

try {
	await once(ee, 'myevent');
} catch (err) {
	console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
	.then(([err]) => console.log('ok', err.message))
	.catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
	try {
		await once(emitter, event, { signal });
		console.log('event emitted!');
	} catch (error) {
		if (error.name === 'AbortError') {
			console.error('Waiting for the event was canceled!');
		} else {
			console.error('There was an error', error.message);
		}
	}
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

**Parameters:**

| Parameter   | Type                        |
| :---------- | :-------------------------- |
| `emitter`   | `_NodeEventTarget`          |
| `eventName` | `string` \| `symbol`        |
| `options`?  | `StaticEventEmitterOptions` |

**Returns:** `Promise`\<`any`[]\>

###### Inherited from

`Duplex.once`

###### Since

v11.13.0, v10.16.0

**Source:** node_modules/@types/node/events.d.ts:193

###### once(emitter, eventName, options)

```ts
static once(
   emitter,
   eventName,
options?): Promise<any[]>
```

**Parameters:**

| Parameter   | Type                        |
| :---------- | :-------------------------- |
| `emitter`   | `_DOMEventTarget`           |
| `eventName` | `string`                    |
| `options`?  | `StaticEventEmitterOptions` |

**Returns:** `Promise`\<`any`[]\>

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/events.d.ts:198

##### once()

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1196

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1197

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1198

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1199

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1200

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1201

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1202

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1203

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1204

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1205

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1206

###### once(event, listener)

```ts
once(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.once`

**Source:** node_modules/@types/node/stream.d.ts:1207

##### pause()

```ts
pause(): this
```

The `readable.pause()` method will cause a stream in flowing mode to stop
emitting `'data'` events, switching out of flowing mode. Any data that
becomes available will remain in the internal buffer.

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
	console.log(`Received ${chunk.length} bytes of data.`);
	readable.pause();
	console.log('There will be no additional data for 1 second.');
	setTimeout(() => {
		console.log('Now data will start flowing again.');
		readable.resume();
	}, 1000);
});
```

The `readable.pause()` method has no effect if there is a `'readable'`event listener.

**Returns:** `this`

###### Inherited from

`Duplex.pause`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:251

##### pipe()

```ts
pipe<T>(destination, options?): T
```

**Type parameters:**

| Type parameter               |
| :--------------------------- |
| `T` extends `WritableStream` |

**Parameters:**

| Parameter      | Type      |
| :------------- | :-------- |
| `destination`  | `T`       |
| `options`?     | `Object`  |
| `options.end`? | `boolean` |

**Returns:** `T`

###### Inherited from

`Duplex.pipe`

**Source:** node_modules/@types/node/stream.d.ts:29

##### prependListener()

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1208

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1209

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1210

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1211

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1212

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1213

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1214

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1215

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1216

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1217

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1218

###### prependListener(event, listener)

```ts
prependListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependListener`

**Source:** node_modules/@types/node/stream.d.ts:1219

##### prependOnceListener()

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1220

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1221

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1222

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1223

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1224

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1225

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1226

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1227

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1228

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1229

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1230

###### prependOnceListener(event, listener)

```ts
prependOnceListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.prependOnceListener`

**Source:** node_modules/@types/node/stream.d.ts:1231

##### push()

```ts
push(chunk, encoding?): boolean
```

**Parameters:**

| Parameter   | Type             |
| :---------- | :--------------- |
| `chunk`     | `any`            |
| `encoding`? | `BufferEncoding` |

**Returns:** `boolean`

###### Inherited from

`Duplex.push`

**Source:** node_modules/@types/node/stream.d.ts:407

##### rawListeners()

```ts
rawListeners(eventName): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

**Parameters:**

| Parameter   | Type                 |
| :---------- | :------------------- |
| `eventName` | `string` \| `symbol` |

**Returns:** `Function`[]

###### Inherited from

`Duplex.rawListeners`

###### Since

v9.4.0

**Source:** node_modules/@types/node/events.d.ts:766

##### read()

```ts
read(size?): any
```

The `readable.read()` method reads data out of the internal buffer and
returns it. If no data is available to be read, `null` is returned. By default,
the data is returned as a `Buffer` object unless an encoding has been
specified using the `readable.setEncoding()` method or the stream is operating
in object mode.

The optional `size` argument specifies a specific number of bytes to read. If`size` bytes are not available to be read, `null` will be returned \_unless_the stream has ended, in which
case all of the data remaining in the internal
buffer will be returned.

If the `size` argument is not specified, all of the data contained in the
internal buffer will be returned.

The `size` argument must be less than or equal to 1 GiB.

The `readable.read()` method should only be called on `Readable` streams
operating in paused mode. In flowing mode, `readable.read()` is called
automatically until the internal buffer is fully drained.

```js
const readable = getReadableStreamSomehow();

// 'readable' may be triggered multiple times as data is buffered in
readable.on('readable', () => {
	let chunk;
	console.log('Stream is readable (new data received in buffer)');
	// Use a loop to make sure we read all currently available data
	while (null !== (chunk = readable.read())) {
		console.log(`Read ${chunk.length} bytes of data...`);
	}
});

// 'end' will be triggered once when there is no more data available
readable.on('end', () => {
	console.log('Reached end of stream.');
});
```

Each call to `readable.read()` returns a chunk of data, or `null`. The chunks
are not concatenated. A `while` loop is necessary to consume all data
currently in the buffer. When reading a large file `.read()` may return `null`,
having consumed all buffered content so far, but there is still more data to
come not yet buffered. In this case a new `'readable'` event will be emitted
when there is more data in the buffer. Finally the `'end'` event will be
emitted when there is no more data to come.

Therefore to read a file's whole contents from a `readable`, it is necessary
to collect chunks across multiple `'readable'` events:

```js
const chunks = [];

readable.on('readable', () => {
	let chunk;
	while (null !== (chunk = readable.read())) {
		chunks.push(chunk);
	}
});

readable.on('end', () => {
	const content = chunks.join('');
});
```

A `Readable` stream in object mode will always return a single item from
a call to `readable.read(size)`, regardless of the value of the`size` argument.

If the `readable.read()` method returns a chunk of data, a `'data'` event will
also be emitted.

Calling [read](#read) after the `'end'` event has
been emitted will return `null`. No runtime error will be raised.

**Parameters:**

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `size`?   | `number` | Optional argument to specify how much data to read. |

**Returns:** `any`

###### Inherited from

`Duplex.read`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:204

##### reduce()

###### reduce(fn, initial, options)

```ts
reduce<T>(
   fn,
   initial?,
options?): Promise<T>
```

This method calls _fn_ on each chunk of the stream in order, passing it the result from the calculation
on the previous element. It returns a promise for the final value of the reduction.

If no _initial_ value is supplied the first chunk of the stream is used as the initial value.
If the stream is empty, the promise is rejected with a `TypeError` with the `ERR_INVALID_ARGS` code property.

The reducer function iterates the stream element-by-element which means that there is no _concurrency_ parameter
or parallelism. To perform a reduce concurrently, you can extract the async function to `readable.map` method.

**Type parameters:**

| Type parameter | Value |
| :------------- | :---- |
| `T`            | `any` |

**Parameters:**

| Parameter  | Type                                    | Description                                                              |
| :--------- | :-------------------------------------- | :----------------------------------------------------------------------- |
| `fn`       | (`previous`, `data`, `options`?) => `T` | a reducer function to call over every chunk in the stream. Async or not. |
| `initial`? | `undefined`                             | the initial value to use in the reduction.                               |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\>    | -                                                                        |

**Returns:** `Promise`\<`T`\>

a promise for the final value of the reduction.

###### Inherited from

`Duplex.reduce`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:556

###### reduce(fn, initial, options)

```ts
reduce<T>(
   fn,
   initial,
options?): Promise<T>
```

**Type parameters:**

| Type parameter | Value |
| :------------- | :---- |
| `T`            | `any` |

**Parameters:**

| Parameter  | Type                                    |
| :--------- | :-------------------------------------- |
| `fn`       | (`previous`, `data`, `options`?) => `T` |
| `initial`  | `T`                                     |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\>    |

**Returns:** `Promise`\<`T`\>

###### Inherited from

`Duplex.reduce`

**Source:** node_modules/@types/node/stream.d.ts:561

##### removeAllListeners()

```ts
removeAllListeners(event?): this
```

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**Parameters:**

| Parameter | Type                 |
| :-------- | :------------------- |
| `event`?  | `string` \| `symbol` |

**Returns:** `this`

###### Inherited from

`Duplex.removeAllListeners`

###### Since

v0.1.26

**Source:** node_modules/@types/node/events.d.ts:706

##### removeListener()

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1232

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                |
| :--------- | :------------------ |
| `event`    | `"data"`            |
| `listener` | (`chunk`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1233

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"drain"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1234

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1235

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"error"`         |
| `listener` | (`err`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1236

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"finish"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1237

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1238

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"pipe"`          |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1239

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1240

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1241

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type              |
| :--------- | :---------------- |
| `event`    | `"unpipe"`        |
| `listener` | (`src`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1242

###### removeListener(event, listener)

```ts
removeListener(event, listener): this
```

**Parameters:**

| Parameter  | Type                  |
| :--------- | :-------------------- |
| `event`    | `string` \| `symbol`  |
| `listener` | (...`args`) => `void` |

**Returns:** `this`

###### Inherited from

`Duplex.removeListener`

**Source:** node_modules/@types/node/stream.d.ts:1243

##### resume()

```ts
resume(): this
```

The `readable.resume()` method causes an explicitly paused `Readable` stream to
resume emitting `'data'` events, switching the stream into flowing mode.

The `readable.resume()` method can be used to fully consume the data from a
stream without actually processing any of that data:

```js
getReadableStreamSomehow()
	.resume()
	.on('end', () => {
		console.log('Reached the end, but did not read anything.');
	});
```

The `readable.resume()` method has no effect if there is a `'readable'`event listener.

**Returns:** `this`

###### Inherited from

`Duplex.resume`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:270

##### setDefaultEncoding()

```ts
setDefaultEncoding(encoding): this
```

**Parameters:**

| Parameter  | Type             |
| :--------- | :--------------- |
| `encoding` | `BufferEncoding` |

**Returns:** `this`

###### Inherited from

`Duplex.setDefaultEncoding`

**Source:** node_modules/@types/node/stream.d.ts:1115

##### setEncoding()

```ts
setEncoding(encoding): this
```

The `readable.setEncoding()` method sets the character encoding for
data read from the `Readable` stream.

By default, no encoding is assigned and stream data will be returned as`Buffer` objects. Setting an encoding causes the stream data
to be returned as strings of the specified encoding rather than as `Buffer`objects. For instance, calling `readable.setEncoding('utf8')` will cause the
output data to be interpreted as UTF-8 data, and passed as strings. Calling`readable.setEncoding('hex')` will cause the data to be encoded in hexadecimal
string format.

The `Readable` stream will properly handle multi-byte characters delivered
through the stream that would otherwise become improperly decoded if simply
pulled from the stream as `Buffer` objects.

```js
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
	assert.equal(typeof chunk, 'string');
	console.log('Got %d characters of string data:', chunk.length);
});
```

**Parameters:**

| Parameter  | Type             | Description          |
| :--------- | :--------------- | :------------------- |
| `encoding` | `BufferEncoding` | The encoding to use. |

**Returns:** `this`

###### Inherited from

`Duplex.setEncoding`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:229

##### setMaxListeners()

```ts
static setMaxListeners(n?, ...eventTargets?): void
```

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

**Parameters:**

| Parameter          | Type                                    | Description                                                                     |
| :----------------- | :-------------------------------------- | :------------------------------------------------------------------------------ |
| `n`?               | `number`                                | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| ...`eventTargets`? | (`EventEmitter` \| `_DOMEventTarget`)[] | -                                                                               |

**Returns:** `void`

###### Inherited from

`Duplex.setMaxListeners`

###### Since

v15.4.0

**Source:** node_modules/@types/node/events.d.ts:352

##### setMaxListeners()

```ts
setMaxListeners(n): this
```

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `n`       | `number` |

**Returns:** `this`

###### Inherited from

`Duplex.setMaxListeners`

###### Since

v0.3.5

**Source:** node_modules/@types/node/events.d.ts:716

##### some()

```ts
some(fn, options?): Promise<boolean>
```

This method is similar to `Array.prototype.some` and calls _fn_ on each chunk in the stream
until the awaited return value is `true` (or any truthy value). Once an _fn_ call on a chunk
`await`ed return value is truthy, the stream is destroyed and the promise is fulfilled with `true`.
If none of the _fn_ calls on the chunks return a truthy value, the promise is fulfilled with `false`.

**Parameters:**

| Parameter  | Type                                                        | Description                                                   |
| :--------- | :---------------------------------------------------------- | :------------------------------------------------------------ |
| `fn`       | (`data`, `options`?) => `boolean` \| `Promise`\<`boolean`\> | a function to call on each chunk of the stream. Async or not. |
| `options`? | `ArrayOptions`                                              | -                                                             |

**Returns:** `Promise`\<`boolean`\>

a promise evaluating to `true` if _fn_ returned a truthy value for at least one of the chunks.

###### Inherited from

`Duplex.some`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:475

##### take()

```ts
take(limit, options?): Readable
```

This method returns a new stream with the first _limit_ chunks.

**Parameters:**

| Parameter  | Type                                 | Description                                     |
| :--------- | :----------------------------------- | :---------------------------------------------- |
| `limit`    | `number`                             | the number of chunks to take from the readable. |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\> | -                                               |

**Returns:** `Readable`

a stream with _limit_ chunks taken.

###### Inherited from

`Duplex.take`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:534

##### timing()

```ts
timing(start, end): void
```

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `start`   | `string` |
| `end`     | `string` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### toArray()

```ts
toArray(options?): Promise<any[]>
```

This method allows easily obtaining the contents of a stream.

As this method reads the entire stream into memory, it negates the benefits of streams. It's intended
for interoperability and convenience, not as the primary way to consume streams.

**Parameters:**

| Parameter  | Type                                 |
| :--------- | :----------------------------------- |
| `options`? | `Pick`\<`ArrayOptions`, `"signal"`\> |

**Returns:** `Promise`\<`any`[]\>

a promise containing an array with the contents of the stream.

###### Inherited from

`Duplex.toArray`

###### Since

v17.5.0

**Source:** node_modules/@types/node/stream.d.ts:465

##### toWeb()

<span class="tag danger">Experimental</span>

```ts
static toWeb(streamDuplex): {
  readable: ReadableStream<any>;
  writable: WritableStream<any>;
}
```

A utility method for creating a web `ReadableStream` and `WritableStream` from a `Duplex`.

**Parameters:**

| Parameter      | Type     |
| :------------- | :------- |
| `streamDuplex` | `Duplex` |

**Returns:** ```ts
{
readable: ReadableStream<any>;
writable: WritableStream<any>;
}

````

###### readable

```ts
readable: ReadableStream<any>;
````

###### writable

```ts
writable: WritableStream<any>;
```

###### Inherited from

`Duplex.toWeb`

###### Since

v17.0.0

**Source:** node_modules/@types/node/stream.d.ts:1126

##### uncork()

```ts
uncork(): void
```

**Returns:** `void`

###### Inherited from

`Duplex.uncork`

**Source:** node_modules/@types/node/stream.d.ts:1120

##### unpipe()

```ts
unpipe(destination?): this
```

The `readable.unpipe()` method detaches a `Writable` stream previously attached
using the [pipe](#pipe) method.

If the `destination` is not specified, then _all_ pipes are detached.

If the `destination` is specified, but no pipe is set up for it, then
the method does nothing.

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
	console.log('Stop writing to file.txt.');
	readable.unpipe(writable);
	console.log('Manually close the file stream.');
	writable.end();
}, 1000);
```

**Parameters:**

| Parameter      | Type             | Description                        |
| :------------- | :--------------- | :--------------------------------- |
| `destination`? | `WritableStream` | Optional specific stream to unpipe |

**Returns:** `this`

###### Inherited from

`Duplex.unpipe`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:314

##### unshift()

```ts
unshift(chunk, encoding?): void
```

Passing `chunk` as `null` signals the end of the stream (EOF) and behaves the
same as `readable.push(null)`, after which no more data can be written. The EOF
signal is put at the end of the buffer and any buffered data will still be
flushed.

The `readable.unshift()` method pushes a chunk of data back into the internal
buffer. This is useful in certain situations where a stream is being consumed by
code that needs to "un-consume" some amount of data that it has optimistically
pulled out of the source, so that the data can be passed on to some other party.

The `stream.unshift(chunk)` method cannot be called after the `'end'` event
has been emitted or a runtime error will be thrown.

Developers using `stream.unshift()` often should consider switching to
use of a `Transform` stream instead. See the `API for stream implementers` section for more information.

```js
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
	stream.on('error', callback);
	stream.on('readable', onReadable);
	const decoder = new StringDecoder('utf8');
	let header = '';
	function onReadable() {
		let chunk;
		while (null !== (chunk = stream.read())) {
			const str = decoder.write(chunk);
			if (str.includes('\n\n')) {
				// Found the header boundary.
				const split = str.split(/\n\n/);
				header += split.shift();
				const remaining = split.join('\n\n');
				const buf = Buffer.from(remaining, 'utf8');
				stream.removeListener('error', callback);
				// Remove the 'readable' listener before unshifting.
				stream.removeListener('readable', onReadable);
				if (buf.length) stream.unshift(buf);
				// Now the body of the message can be read from the stream.
				callback(null, header, stream);
				return;
			}
			// Still reading the header.
			header += str;
		}
	}
}
```

Unlike [push](#push), `stream.unshift(chunk)` will not
end the reading process by resetting the internal reading state of the stream.
This can cause unexpected results if `readable.unshift()` is called during a
read (i.e. from within a [\_read](#_read) implementation on a
custom stream). Following the call to `readable.unshift()` with an immediate [push](#push) will reset the reading state appropriately,
however it is best to simply avoid calling `readable.unshift()` while in the
process of performing a read.

**Parameters:**

| Parameter   | Type             | Description                                                                                                                                                                                                             |
| :---------- | :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chunk`     | `any`            | Chunk of data to unshift onto the read queue. For streams not operating in object mode, `chunk` must be a string, `Buffer`, `Uint8Array`, or `null`. For object mode<br />streams, `chunk` may be any JavaScript value. |
| `encoding`? | `BufferEncoding` | Encoding of string chunks. Must be a valid `Buffer` encoding, such as `'utf8'` or `'ascii'`.                                                                                                                            |

**Returns:** `void`

###### Inherited from

`Duplex.unshift`

###### Since

v0.9.11

**Source:** node_modules/@types/node/stream.d.ts:380

##### warn()

```ts
warn(contents): void
```

**Parameters:**

| Parameter  | Type      |
| :--------- | :-------- |
| `contents` | `unknown` |

**Returns:** `void`  
**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

##### wrap()

```ts
wrap(stream): this
```

Prior to Node.js 0.10, streams did not implement the entire `node:stream`module API as it is currently defined. (See `Compatibility` for more
information.)

When using an older Node.js library that emits `'data'` events and has a [pause](#pause) method that is advisory only, the`readable.wrap()` method can be used to create a `Readable`
stream that uses
the old stream as its data source.

It will rarely be necessary to use `readable.wrap()` but the method has been
provided as a convenience for interacting with older Node.js applications and
libraries.

```js
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
	myReader.read(); // etc.
});
```

**Parameters:**

| Parameter | Type             | Description                    |
| :-------- | :--------------- | :----------------------------- |
| `stream`  | `ReadableStream` | An "old style" readable stream |

**Returns:** `this`

###### Inherited from

`Duplex.wrap`

###### Since

v0.9.4

**Source:** node_modules/@types/node/stream.d.ts:406

##### write()

###### write(chunk, encoding, cb)

```ts
write(
   chunk,
   encoding?,
   cb?): boolean
```

**Parameters:**

| Parameter   | Type                |
| :---------- | :------------------ |
| `chunk`     | `any`               |
| `encoding`? | `BufferEncoding`    |
| `cb`?       | (`error`) => `void` |

**Returns:** `boolean`

###### Inherited from

`Duplex.write`

**Source:** node_modules/@types/node/stream.d.ts:1113

###### write(chunk, cb)

```ts
write(chunk, cb?): boolean
```

**Parameters:**

| Parameter | Type                |
| :-------- | :------------------ |
| `chunk`   | `any`               |
| `cb`?     | (`error`) => `void` |

**Returns:** `boolean`

###### Inherited from

`Duplex.write`

**Source:** node_modules/@types/node/stream.d.ts:1114

## Type Aliases

### LineType

```ts
type LineType:
  | "start"
  | "end"
  | "error"
  | "warn"
  | "info"
  | "log"
  | "debug"
  | "timing";
```

**Source:** [modules/logger/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/types.ts)

---

### LogStepOptions

```ts
type LogStepOptions: {
  description: string;
  name: string;
  verbosity: Verbosity;
};
```

#### Type declaration

##### description?

```ts
optional description: string;
```

##### name

```ts
name: string;
```

##### verbosity

```ts
verbosity: Verbosity;
```

**Source:** [modules/logger/src/LogStep.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/LogStep.ts)

---

### LoggedBuffer

```ts
type LoggedBuffer: {
  contents: string;
  group: string;
  hasError: boolean;
  type: LineType;
  verbosity: Verbosity;
};
```

#### Type declaration

##### contents

```ts
contents: string;
```

##### group?

```ts
optional group: string;
```

##### hasError?

```ts
optional hasError: boolean;
```

##### type

```ts
type: LineType;
```

##### verbosity

```ts
verbosity: Verbosity;
```

**Source:** [modules/logger/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/types.ts)

## Variables

### defaultConfig

```ts
const defaultConfig: Required<RootConfig>;
```

**Source:** [modules/onerepo/src/setup/setup.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/setup/setup.ts)

## Functions

### restoreCursor()

```ts
restoreCursor(): void
```

Gracefully restore the CLI cursor on exit.

Prevent the cursor you have hidden interactively from remaining hidden if the process crashes.

It does nothing if run in a non-TTY context.

**Returns:** `void`

#### Example

```
import restoreCursor from 'restore-cursor';

restoreCursor();
```

**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

## Commands

### Argv\<CommandArgv\>

```ts
type Argv<CommandArgv>: Arguments<CommandArgv & DefaultArgv>;
```

Helper for combining local parsed arguments along with the default arguments provided by the oneRepo command module.

**Type parameters:**

| Type parameter | Value    | Description                                                                                                                                |
| :------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command, always a union with [`DefaultArgv`](#defaultargv) and [`PositionalArgv`](#positionalargv). |

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### Builder\<CommandArgv\>

```ts
type Builder<CommandArgv>: (yargs) => Yargv<CommandArgv>;
```

Option argument parser for the given command. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for more, but note that only the object variant is not accepted – only function variants will be accepted in oneRepo commands.

For common arguments that work in conjunction with [`HandlerExtra`](#handlerextra) methods like `getAffected()`, you can use helpers from the [`builders` namespace](namespaces/builders/), like [`builders.withAffected()`](namespaces/builders/#withaffected).

```ts
type Argv = {
	'with-tacos'?: boolean;
};

export const builder: Builder<Argv> = (yargs) =>
	yargs.usage(`$0 ${command}`).option('with-tacos', {
		description: 'Include tacos',
		type: 'boolean',
	});
```

**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- Common extensions via the [`builders`](namespaces/builders/) namespace.

**Type parameters:**

| Type parameter | Value    | Description                                    |
| :------------- | :------- | :--------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command |

**Parameters:**

| Parameter | Type    | Description                                                                                               |
| :-------- | :------ | :-------------------------------------------------------------------------------------------------------- |
| `yargs`   | `Yargs` | The Yargs instance. See [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) |

**Returns:** `Yargv`\<`CommandArgv`\>  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### DefaultArgv

```ts
type DefaultArgv: {
  dry-run: boolean;
  quiet: boolean;
  skip-engine-check: boolean;
  verbosity: number;
};
```

Default arguments provided globally for all commands. These arguments are included by when using [`Builder`](#buildercommandargv) and [`Handler`](#handlercommandargv).

#### Type declaration

##### dry-run

```ts
dry-run: boolean;
```

Whether the command should run non-destructive dry-mode. This prevents all subprocesses, files, and git operations from running unless explicitly specified as safe to run.

Also internally sets `process.env.ONEREPO_DRY_RUN = 'true'`.

**Default:** `false`

##### quiet

```ts
quiet: boolean;
```

Silence all logger output. Prevents _all_ stdout and stderr output from the logger entirely.

**Default:** `false`

##### skip-engine-check

```ts
skip-engine-check: boolean;
```

Skip the engines check. When `false`, oneRepo will the current process's node version with the range for `engines.node` as defined in `package.json`. If not defined in the root `package.json`, this will be skipped.

**Default:** `false`

##### verbosity

```ts
verbosity: number;
```

Verbosity level for the Logger. See Logger.verbosity for more information.

**Default:** `3`  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### Handler\<CommandArgv\>

```ts
type Handler<CommandArgv>: (argv, extra) => Promise<void>;
```

Command handler that includes oneRepo tools like `graph`, `logger`, and more. This function is type-safe if `Argv` is correctly passed through to the type definition.

```ts
type Argv = {
	'with-tacos'?: boolean;
};
export const handler: Handler<Argv> = (argv, { logger }) => {
	const { 'with-tacos': withTacos, '--': passthrough } = argv;
	logger.log(withTacos ? 'Include tacos' : 'No tacos, thanks');
	logger.debug(passthrough);
};
```

**See also:**

- [Yargs `.command(module)`](http://yargs.js.org/docs/#api-reference-commandmodule) for general usage.
- [`HandlerExtra`](#handlerextra) for extended extra arguments provided above and beyond the scope of Yargs.

**Type parameters:**

| Type parameter | Value    | Description                                                                                                                                |
| :------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `CommandArgv`  | `object` | Arguments that will be parsed for this command. DefaultArguments will be automatically merged into this object for use within the handler. |

**Parameters:**

| Parameter | Type                                        |
| :-------- | :------------------------------------------ |
| `argv`    | [`Argv`](#argvcommandargv)\<`CommandArgv`\> |
| `extra`   | [`HandlerExtra`](#handlerextra)             |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### HandlerExtra

```ts
type HandlerExtra: {
  config: Required<RootConfig>;
  getAffected: (opts?) => Promise<Workspace[]>;
  getFilepaths: (opts?) => Promise<string[]>;
  getWorkspaces: (opts?) => Promise<Workspace[]>;
  graph: Graph;
  logger: Logger;
};
```

Commands in oneRepo extend beyond what Yargs is able to provide by adding a second argument to the handler.

All extras are available as the second argument on your [`Handler`](#handlercommandargv)

```ts
export const handler: Handler = (argv, { getAffected, getFilepaths, getWorkspace, logger }) => {
	logger.warn('Nothing to do!');
};
```

Overriding the affected threshold in `getFilepaths`

```ts
export const handler: Handler = (argv, { getFilepaths }) => {
	const filepaths = await getFilepaths({ affectedThreshold: 0 });
};
```

#### Type declaration

##### config

```ts
config: Required<RootConfig>;
```

This repository’s oneRepo [config](#rootconfigcustomlifecycles), resolved with all defaults.

##### getAffected

```ts
getAffected: (opts?) => Promise<Workspace[]>;
```

Get the affected Workspaces based on the current state of the repository.

This is a wrapped implementation of [`builders.getAffected`](namespaces/builders/#getaffected) that does not require passing the `graph` argument.

**Parameters:**

| Parameter | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `opts`?   | [`GetterOptions`](namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### getFilepaths

```ts
getFilepaths: (opts?) => Promise<string[]>;
```

Get the affected filepaths based on the current inputs and state of the repository. Respects manual inputs provided by [`builders.withFiles`](namespaces/builders/#withfiles) if provided.

This is a wrapped implementation of [`builders.getFilepaths`](namespaces/builders/#getfilepaths) that does not require the `graph` and `argv` arguments.

**Note:** that when used with `--affected`, there is a default limit of 100 files before this will switch to returning affected Workspace paths. Use `affectedThreshold: 0` to disable the limit.  
**Parameters:**

| Parameter | Type                                                          |
| :-------- | :------------------------------------------------------------ |
| `opts`?   | [`FileGetterOptions`](namespaces/builders/#filegetteroptions) |

**Returns:** `Promise`\<`string`[]\>

##### getWorkspaces

```ts
getWorkspaces: (opts?) => Promise<Workspace[]>;
```

Get the affected Workspaces based on the current inputs and the state of the repository.
This function differs from `getAffected` in that it respects all input arguments provided by
[`builders.withWorkspaces`](namespaces/builders/#withworkspaces), [`builders.withFiles`](namespaces/builders/#withfiles) and [`builders.withAffected`](namespaces/builders/#withaffected).

This is a wrapped implementation of [`builders.getWorkspaces`](namespaces/builders/#getworkspaces) that does not require the `graph` and `argv` arguments.

**Parameters:**

| Parameter | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `opts`?   | [`GetterOptions`](namespaces/builders/#getteroptions) |

**Returns:** `Promise`\<[`Workspace`](#workspace)[]\>

##### graph

```ts
graph: Graph;
```

The full monorepo [`Graph`](#graph).

##### logger

```ts
logger: Logger;
```

Standard [`Logger`](#logger). This should _always_ be used in place of `console.log` methods unless you have
a specific need to write to standard out differently.

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

---

### PositionalArgv

```ts
type PositionalArgv: {
  $0: string;
  --: string[];
  _: (string | number)[];
};
```

Always present in Builder and Handler arguments as parsed by Yargs.

#### Type declaration

##### $0

```ts
$0: string;
```

The script name or node command. Similar to `process.argv[1]`

##### --

```ts
--: string[];
```

Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate.

##### \_

```ts
_: (string | number)[];
```

Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.

**Source:** [modules/yargs/src/yargs.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/yargs/src/yargs.ts)

## Config

### Config\<CustomLifecycles\>

```ts
type Config<CustomLifecycles>: RootConfig<CustomLifecycles> | WorkspaceConfig<CustomLifecycles>;
```

Picks the correct config type between `RootConfig` and `WorkspaceConfig` based on whether the `root` property is set. Use this to help ensure your configs do not have any incorrect keys or values.

Satisfy a `RootConfig`:

```ts
import type { Config } from 'onerepo';

export default {
	root: true,
} satisfies Config;
```

Satisfy a `WorkspaceConfig` with custom lifecycles on tasks:

```ts
import type { Config } from 'onerepo';

export default {
	tasks: {
		stage: {
			serial: ['$0 build'],
		},
	},
} satisfies Config<'stage'>;
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Source:** [modules/onerepo/src/types/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/index.ts)

---

### Lifecycle

```ts
type Lifecycle:
  | "pre-commit"
  | "post-commit"
  | "post-checkout"
  | "pre-merge"
  | "post-merge"
  | "build"
  | "pre-deploy"
  | "pre-publish"
  | "post-publish";
```

oneRepo comes with a pre-configured list of common lifecycles for grouping [tasks](/core/tasks/).

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### RootConfig\<CustomLifecycles\>

```ts
type RootConfig<CustomLifecycles>: {
  changes: {
     filenames: "hash" | "human";
     formatting: {
        commit: string;
        footer: string;
     };
     prompts: "guided" | "semver";
  };
  codeowners: Record<string, string[]>;
  commands: {
     directory: string | false;
     ignore: RegExp;
  };
  dependencies: {
     dedupe: boolean;
     mode: "strict" | "loose" | "off";
  };
  head: string;
  ignore: string[];
  meta: Record<string, unknown>;
  plugins: Plugin[];
  root: true;
  taskConfig: {
     lifecycles: CustomLifecycles[];
     stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
  };
  tasks: TaskConfig<CustomLifecycles>;
  templateDir: string;
  validation: {
     schema: string | null;
  };
  vcs: {
     autoSyncHooks: boolean;
     hooksPath: string;
     provider: "github" | "gitlab" | "bitbucket" | "gitea";
  };
  visualizationUrl: string;
};
```

Setup configuration for the root of the repository.

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

#### Type declaration

##### changes?

```ts
optional changes: {
  filenames: "hash" | "human";
  formatting: {
     commit: string;
     footer: string;
  };
  prompts: "guided" | "semver";
};
```

##### changes.filenames?

```ts
optional filenames: "hash" | "human";
```

**Default:** `'hash'`

To generate human-readable unique filenames for change files, ensure [human-id](https://www.npmjs.com/package/human-id) is installed.

##### changes.formatting?

```ts
optional formatting: {
  commit: string;
  footer: string;
};
```

**Default:** `{}`

Override some formatting strings in generated changelog files.

```ts title="onerepo.config.ts"
export default {
	root: true,
	changes: {
		formatting: {
			commit: '([${ref.short}](https://github.com/paularmstrong/onerepo/commit/${ref}))',
			footer:
				'> Full changelog [${fromRef.short}...${throughRef.short}](https://github.com/my-repo/commits/${fromRef}...${throughRef})',
		},
	},
};
```

##### changes.formatting.commit?

```ts
optional commit: string;
```

**Default:** `'(${ref.short})'`

Format how the commit ref will appear at the end of the first line of each change entry.

Available replacement strings:
| Replacement | Description |
| --- | --- |
| `${ref.short}` | 8-character version of the commit ref |
| `${ref}` | Full commit ref |

##### changes.formatting.footer?

```ts
optional footer: string;
```

**Default:** `'_View git logs for full change list._'`

Format the footer at the end of each version in the generated changelog files.

Available replacement strings:
| Replacement | Description |
| --- | --- |
| `${fromRef.short}` | 8-character version of the first commit ref in the version |
| `${fromRef}` | Full commit ref of the first commit in the version |
| `${through.short}` | 8-character version of the last commit ref in the version |
| `${through}` | Full commit ref of the last commit in the version |
| `${version}` | New version string |

##### changes.prompts?

```ts
optional prompts: "guided" | "semver";
```

**Default:** `'guided'`

Change the prompt question & answer style when adding change entries.

- `'guided'`: Gives more detailed explanations when release types.
- `'semver'`: A simple choice list of semver release types.

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Default:** `{}`

Map of paths to array of owners.

When used with the [`codeowners` commands](https://onerepo.tools/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your [`vcsProvider`](#vcsprovider) as well as verifying that the root file is up to date.

```ts title="onerepo.config.ts"
export default {
	root: true,
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

##### commands?

```ts
optional commands: {
  directory: string | false;
  ignore: RegExp;
};
```

Configuration for custom commands.

##### commands.directory?

```ts
optional directory: string | false;
```

**Default:** `'commands'`

A string to use as filepaths to subcommands. We'll look for commands in all Workspaces using this string. If any are found, they'll be available from the CLI.

```ts title="onerepo.config.ts"
export default {
	root: true,
	commands: {
		directory: 'commands',
	},
};
```

Given the preceding configuration, commands will be searched for within the `commands/` directory at the root of the repository as well as a directory of the same name at the root of each Workspace:

- `<root>/commands/*`
- `<root>/<workspaces>/commands/*`

##### commands.ignore?

```ts
optional ignore: RegExp;
```

**Default:** `/(/__\w+__/|\.test\.|\.spec\.|\.config\.)/`

Prevent reading matched files in the `commands.directory` as commands.

When writing custom commands and Workspace-level subcommands, we may need to ignore certain files like tests, fixtures, and other helpers. Use a regular expression here to configure which files will be ignored when oneRepo parses and executes commands.

```ts title="onerepo.config.ts"
export default {
	root: true,
	commands: {
		ignore: /(/__\w+__/|\.test\.|\.spec\.|\.config\.)/,
	},
};
```

##### dependencies?

```ts
optional dependencies: {
  dedupe: boolean;
  mode: "strict" | "loose" | "off";
};
```

##### dependencies.dedupe?

```ts
optional dedupe: boolean;
```

**Default:** `true`

When modifying dependencies using the `one dependencies` command, a `dedupe` will automatically be run to reduce duplicate package versions that overlap the requested ranges. Set this to `false` to disable this behavior.

##### dependencies.mode?

```ts
optional mode: "strict" | "loose" | "off";
```

**Default:** `'loose'`

The dependency mode will be used for node module dependency management and verification.

- `off`: No validation will occur. Everything goes.
- `loose`: Reused third-party dependencies will be required to have semantic version overlap across unique branches of the Graph.
- `strict`: Versions of all dependencies across each discrete Workspace dependency tree must be strictly equal.

##### head?

```ts
optional head: string;
```

**Default:** `'main'`

The default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.

```ts title="onerepo.config.ts"
export default {
	root: true,
	head: 'develop',
};
```

##### ignore?

```ts
optional ignore: string[];
```

**Default:** `[]`

Array of fileglobs to ignore when calculating the changed Workspaces.

Periodically we may find that there are certain files or types of files that we _know_ for a fact do not affect the validity of the repository or any code. When this happens and the files are modified, unnecessary tasks and processes will be spun up that don't have any bearing on the outcome of the change.

To avoid extra processing, we can add file globs to ignore when calculated the afected Workspace graph.

:::caution
This configuration should be used sparingly and with caution. It is better to do too much work as opposed to not enough.
:::

```ts title="onerepo.config.ts"
export default {
	root: true,
	ignore: ['.github/*'],
};
```

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Default:** `{}`

A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.

```ts title="onerepo.config.ts"
export default {
	root: true,
	meta: {
		tacos: 'are delicious',
	},
};
```

##### plugins?

```ts
optional plugins: Plugin[];
```

**Default:** `[]`

Add shared commands and extra handlers. See the [official plugin list](https://onerepo.tools/plugins/) for more information.

```ts title="onerepo.config.ts"
import { eslint } from '@onerepo/plugins-eslint';
export default {
	plugins: [eslint()],
};
```

##### root

```ts
root: true;
```

Must be set to `true` in order to denote that this is the root of the repository.

##### taskConfig?

```ts
optional taskConfig: {
  lifecycles: CustomLifecycles[];
  stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
};
```

Optional extra configuration for `tasks`.

##### taskConfig.lifecycles?

```ts
optional lifecycles: CustomLifecycles[];
```

**Default:** `[]`

Additional `task` lifecycles to make available.

See [`Lifecycle`](#lifecycle) for a list of pre-configured lifecycles.

```ts title="onerepo.config.ts"
export default {
	root: true,
	tasks: {
		lifecycles: ['deploy-staging'],
	},
};
```

##### taskConfig.stashUnstaged?

```ts
optional stashUnstaged: CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle[];
```

**Default:** `['pre-commit']`
Stash unstaged changes before running these tasks and re-apply them after the task has completed.

```ts title="onerepo.config.ts"
export default {
	root: true,
	tasks: {
		stashUnstaged: ['pre-commit', 'post-checkout'],
	},
};
```

##### tasks?

```ts
optional tasks: TaskConfig<CustomLifecycles>;
```

**Default:** `{}`

Globally defined tasks per lifecycle. Tasks defined here will be assumed to run for all changes, regardless of affected Workspaces. Refer to the [`tasks` command](https://onerepo.tools/core/tasks/) specifications for details and examples.

##### templateDir?

```ts
optional templateDir: string;
```

**Default:** `'./config/templates'`

Folder path for [`generate` command’s](https://onerepo.tools/core/generate/) templates.

##### validation?

```ts
optional validation: {
  schema: string | null;
};
```

##### validation.schema?

```ts
optional schema: string | null;
```

**Default:** `undefined`

File path for custom Graph and configuration file validation schema.

##### vcs?

```ts
optional vcs: {
  autoSyncHooks: boolean;
  hooksPath: string;
  provider: "github" | "gitlab" | "bitbucket" | "gitea";
};
```

Version control system settings.

##### vcs.autoSyncHooks?

```ts
optional autoSyncHooks: boolean;
```

**Default:** `false`

Automatically set and sync oneRepo-managed git hooks. Change the directory for your git hooks with the [`vcs.hooksPath`](#vcshookspath) setting. Refer to the [Git hooks documentation](https://onerepo.tools/core/hooks/) to learn more.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		autoSyncHooks: false,
	},
};
```

##### vcs.hooksPath?

```ts
optional hooksPath: string;
```

**Default:** `'.hooks'`

Modify the default git hooks path for the repository. This will automatically be synchronized via `one hooks sync` unless explicitly disabled by setting [`vcs.autoSyncHooks`](#vcsautosynchooks) to `false`.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		hooksPath: '.githooks',
	},
};
```

##### vcs.provider?

```ts
optional provider: "github" | "gitlab" | "bitbucket" | "gitea";
```

**Default:** `'github'`

The provider will be factored in to various commands, like `CODEOWNERS` generation.

```ts title="onerepo.config.ts"
export default {
	root: true,
	vcs: {
		provider: 'github',
	},
};
```

##### visualizationUrl?

```ts
optional visualizationUrl: string;
```

**Default:** `'https://onerepo.tools/visualize/'`

Override the URL used to visualize the Graph. The Graph data will be attached the the `g` query parameter as a JSON string of the DAG, compressed using zLib deflate.

**Source:** [modules/onerepo/src/types/config-root.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-root.ts)

---

### Task

```ts
type Task: string | TaskDef | string[];
```

A Task can either be a string or [`TaskDef`](#taskdef) object with extra options, or an array of strings. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

To run sequences of commands with `match` and `meta` information, you can pass an array of strings to the `cmd` property of a [`TaskDef`](#taskdef).

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### TaskConfig\<CustomLifecycles\>

```ts
type TaskConfig<CustomLifecycles>: Partial<Record<CustomLifecycles extends string ? Lifecycle | CustomLifecycles : Lifecycle, Tasks>>;
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### TaskDef

```ts
type TaskDef: {
  cmd: string | string[];
  match: string | string[];
  meta: Record<string, unknown>;
};
```

Tasks can optionally include meta information or only be run if the configured `match` glob string matches the modified files. If no files match, the individual task will not be run.

```ts
export default {
	tasks: {
		'pre-commit': {
			parallel: [
				// Only run `astro check` if astro files have been modified
				{ match: '*.astro', cmd: '$0 astro check' },
				// Use a glob match with sequential tasks
				{ match: '*.{ts,js}', cmd: ['$0 lint', '$0 format'] },
			],
		},
	},
} satisfies Config;
```

#### Type declaration

##### cmd

```ts
cmd: string | string[];
```

String command(s) to run. If provided as an array of strings, each command will be run sequentially, waiting for the previous to succeed. If one command fails, the rest in the sequence will not be run.

The commands can use replaced tokens:

- `$0`: the oneRepo CLI for your repository
- `${workspaces}`: replaced with a space-separated list of Workspace names necessary for the given lifecycle

##### match?

```ts
optional match: string | string[];
```

Glob file match. This will force the `cmd` to run if any of the paths in the modified files list match the glob. Conversely, if no files are matched, the `cmd` _will not_ run.

##### meta?

```ts
optional meta: Record<string, unknown>;
```

Extra information that will be provided only when listing tasks with the `--list` option from the `tasks` command. This object is helpful when creating a matrix of runners with GitHub actions or similar CI pipelines.

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### Tasks

```ts
type Tasks: {
  parallel: Task[];
  serial: Task[];
};
```

Individual [`Task`](#task)s in any [`Lifecycle`](#lifecycle) may be grouped to run either serial (one after the other) or in parallel (multiple at the same time).

#### Type declaration

##### parallel?

```ts
optional parallel: Task[];
```

##### serial?

```ts
optional serial: Task[];
```

**Source:** [modules/onerepo/src/types/tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/tasks.ts)

---

### WorkspaceConfig\<CustomLifecycles\>

```ts
type WorkspaceConfig<CustomLifecycles>: {
  codeowners: Record<string, string[]>;
  commands: {
     passthrough: Record<string, {
        command: string;
        description: string;
     }>;
  };
  meta: Record<string, unknown>;
  tasks: TaskConfig<CustomLifecycles>;
};
```

**Type parameters:**

| Type parameter                                | Value  |
| :-------------------------------------------- | :----- |
| `CustomLifecycles` extends `string` \| `void` | `void` |

#### Type declaration

##### codeowners?

```ts
optional codeowners: Record<string, string[]>;
```

**Default:** `{}`.
Map of paths to array of owners.

When used with the [`codeowners` commands](/core/codeowners/), this configuration enables syncing configurations from Workspaces to the appropriate root level CODEOWNERS file given your `RootConfig.vcs.provider` as well as verifying that the root file is up to date.

```ts title="onerepo.config.ts"
export default {
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

##### commands?

```ts
optional commands: {
  passthrough: Record<string, {
     command: string;
     description: string;
  }>;
};
```

Configuration for custom commands. To configure the commands directory, see [`RootConfig` `commands.directory`](#commandsdirectory).

##### commands.passthrough

```ts
passthrough: Record<
	string,
	{
		command: string;
		description: string;
	}
>;
```

**Default:** `{}`

Enable commands from installed dependencies. Similar to running `npx <command>`, but pulled into the oneRepo CLI and able to be limited by Workspace. Passthrough commands _must_ have helpful descriptions.

```ts title="onerepo.config.ts"
export default {
	commands: {
		passthrough: {
			astro: { description: 'Run Astro commands directly.' },
			start: { description: 'Run the Astro dev server.', command: 'astro dev --port=8000' },
		},
	},
};
```

##### meta?

```ts
optional meta: Record<string, unknown>;
```

**Default:** `{}`
A place to put any custom information or configuration. A helpful space for you to extend Workspace configurations for your own custom commands.

```ts title="onerepo.config.ts"
export default {
	meta: {
		tacos: 'are delicious',
	},
};
```

##### tasks?

```ts
optional tasks: TaskConfig<CustomLifecycles>;
```

**Default:** `{}`
Tasks for this Workspace. These will be merged with global tasks and any other affected Workspace tasks. Refer to the [`tasks` command](/core/tasks/) specifications for details and examples.

:::tip[Merging tasks]
Each modified Workspace or Workspace that is affected by another Workspace's modifications will have its tasks evaluated and merged into the full set of tasks for each given lifecycle run. Check the [Tasks reference](/core/tasks/) to learn more.
:::

**Source:** [modules/onerepo/src/types/config-workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/config-workspace.ts)

## Graph

### getGraph()

```ts
getGraph(workingDir?): Graph
```

Get the [`Graph`](#graph) given a particular root working directory. If the working directory is not a monorepo's root, an empty `Graph` will be given in its place.

```ts
const graph = getGraph(process.cwd());
assert.ok(graph.isRoot);
```

**Parameters:**

| Parameter     | Type     |
| :------------ | :------- |
| `workingDir`? | `string` |

**Returns:** [`Graph`](#graph)  
**Source:** [modules/graph/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/index.ts)

---

### Graph

The oneRepo Graph is a representation of the entire repository’s [`Workspaces`](#workspace) and how they depend upon each other. Most commonly, you will want to use the Graph to get lists of Workspaces that either depend on some input or are dependencies thereof:

```ts
const workspacesToCheck = graph.affected('tacos');
for (const ws of workspacesToCheck) {
	// verify no issues based on changes
}
```

The `Graph` also includes various helpers for determining workspaces based on filepaths, name, and other factors.

#### Accessors

##### packageManager

```ts
get packageManager(): PackageManager
```

Get the [PackageManager](#packagemanager-1) that this Graph depends on. This object allows you to run many common package management commands safely, agnostic of any particular flavor of package management. Works with npm, Yarn, and pnpm.

```ts
await graph.packageManager.install();
```

**Returns:** [`PackageManager`](#packagemanager-1)  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### root

```ts
get root(): Workspace
```

This returns the [`Workspace`](#workspace) that is at the root of the repository.

Regardless of how the `workspaces` are configured with the package manager, the root `package.json` is always registered as a Workspace.

```ts
const root = graph.root;
root.isRoot === true;
```

**Returns:** [`Workspace`](#workspace)  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### workspaces

```ts
get workspaces(): Workspace[]
```

Get a list of all [`Workspaces`](#workspace) that are part of the repository \{@Link Graph | `Graph`\}.

```ts
for (const workspace of graph.workspaces) {
	logger.info(workspace.name);
}
```

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

#### Methods

##### affected()

```ts
affected<T>(source, type?): Workspace[]
```

Get a list of [`Workspaces`](#workspace) that will be affected by the given source(s). This is equivalent to `graph.dependents(sources, true)`. See also [`dependents`](#dependents).

```ts
const dependents = graph.dependents(sources, true);
const affected = graph.affected(sources);

assert.isEqual(dependents, affecteed);
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter | Type                  | Description                                 |
| :-------- | :-------------------- | :------------------------------------------ |
| `source`  | `T` \| `T`[]          | -                                           |
| `type`?   | [`DepType`](#deptype) | Filter the dependents to a dependency type. |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### dependencies()

```ts
dependencies<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get all dependency [`Workspaces`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependencies, but all dependencies throughout the entire [`Graph`](#graph). This returns the opposite result of [`dependents`](#dependents).

```ts
for (const workspace of graph.dependencies('tacos')) {
	logger.info(`"${workspace.name}" is a dependency of "tacos"`);
}
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                                      |
| :------------- | :-------------------- | :----------------------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[]          | A list of [`Workspaces`](#workspace) by [`name`](#name)s or any available [`aliases`](#aliases). |
| `includeSelf`? | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array.                 |
| `type`?        | [`DepType`](#deptype) | Filter the dependencies to a dependency type.                                                    |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### dependents()

```ts
dependents<T>(
   sources?,
   includeSelf?,
   type?): Workspace[]
```

Get all dependent [`Workspaces`](#workspace) of one or more input Workspaces or qualified names of Workspaces. This not only returns the direct dependents, but all dependents throughout the entire [`Graph`](#graph). This returns the opposite result of [`dependencies`](#dependencies).

```ts
for (const workspace of graph.dependents('tacos')) {
	logger.info(`"${workspace.name}" depends on "tacos"`);
}
```

**Type parameters:**

| Type parameter                                    |
| :------------------------------------------------ |
| `T` extends `string` \| [`Workspace`](#workspace) |

**Parameters:**

| Parameter      | Type                  | Description                                                                      |
| :------------- | :-------------------- | :------------------------------------------------------------------------------- |
| `sources`?     | `T` \| `T`[]          | One or more Workspaces by name or `Workspace` instance                           |
| `includeSelf`? | `boolean`             | Whether to include the `Workspaces` for the input `sources` in the return array. |
| `type`?        | [`DepType`](#deptype) | Filter the dependents to a dependency type.                                      |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getAllByLocation()

```ts
getAllByLocation(locations): Workspace[]
```

Get all Workspaces given an array of filepaths.

```ts
const workspaces = graph.getAllByLocation([__dirname, 'file:///foo/bar']);
```

**Parameters:**

| Parameter   | Type       | Description                                                   |
| :---------- | :--------- | :------------------------------------------------------------ |
| `locations` | `string`[] | A list of filepath strings. May be file URLs or string paths. |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getAllByName()

```ts
getAllByName(names): Workspace[]
```

Get a list of [`Workspaces`](#workspace) by string names.

```ts
const workspaces = graph.getAllByName(['tacos', 'burritos']);
```

**Parameters:**

| Parameter | Type       | Description                                                                  |
| :-------- | :--------- | :--------------------------------------------------------------------------- |
| `names`   | `string`[] | A list of Workspace [`name`](#name)s or any available [`aliases`](#aliases). |

**Returns:** [`Workspace`](#workspace)[]  
**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getByLocation()

```ts
getByLocation(location): Workspace
```

Get the equivalent [`Workspace`](#workspace) for a filepath. This can be any location within a `Workspace`, not just its root.

```ts title="CommonJS compatible"
// in Node.js
graph.getByLocation(__dirname);
```

```ts title="ESM compatible"
graph.getByLocation(import.meta.url);
```

**Parameters:**

| Parameter  | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `location` | `string` | A string or URL-based filepath. |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace can be found.

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

##### getByName()

```ts
getByName(name): Workspace
```

Get a [`Workspace`](#workspace) by string name.

```ts
const workspace = graph.getByName('my-cool-package');
```

**Parameters:**

| Parameter | Type     | Description                                                           |
| :-------- | :------- | :-------------------------------------------------------------------- |
| `name`    | `string` | A Workspace’s [`name`](#name) or any available [`aliases`](#aliases). |

**Returns:** [`Workspace`](#workspace)

###### Throws

`Error` if no Workspace exists with the given input `name`.

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### Workspace

#### Accessors

##### aliases

```ts
get aliases(): string[]
```

Allow custom array of aliases.
If the fully qualified package name is scoped, this will include the un-scoped name

**Returns:** `string`[]  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### codeowners

```ts
get codeowners(): Required<Record<string, string[]>>
```

**Returns:** `Required`\<`Record`\<`string`, `string`[]\>\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### config

```ts
get config(): Required<RootConfig | WorkspaceConfig>
```

Get the Workspace's configuration

**Returns:** `Required`\<[`RootConfig`](#rootconfigcustomlifecycles) \| [`WorkspaceConfig`](#workspaceconfigcustomlifecycles)\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### dependencies

```ts
get dependencies(): Record<string, string>
```

Get the `package.json` defined production dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### description

```ts
get description(): undefined | string
```

Canonical to the `package.json` `"description"` field.

**Returns:** `undefined` \| `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### devDependencies

```ts
get devDependencies(): Record<string, string>
```

Get the `package.json` defined development dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### isRoot

```ts
get isRoot(): boolean
```

Whether or not this Workspace is the root of the repository / Graph.

**Returns:** `boolean`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### location

```ts
get location(): string
```

Absolute path on the current filesystem to the Workspace.

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### main

```ts
get main(): string
```

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### name

```ts
get name(): string
```

The full `name` of the Workspace, as defined in its `package.json`

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### packageJson

```ts
get packageJson(): PackageJson
```

A full deep copy of the `package.json` file for the Workspace. Modifications to this object will not be preserved on the Workspace.

**Returns:** [`PackageJson`](#packagejson-1)  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### peerDependencies

```ts
get peerDependencies(): Record<string, string>
```

Get the `package.json` defined peer dependencies for the Workspace.

**Returns:** `Record`\<`string`, `string`\>

Map of modules to their version.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### private

```ts
get private(): boolean
```

If a Workspace `package.json` is set to `private: true`, it will not be available to publish through NPM or other package management registries.

**Returns:** `boolean`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### publishablePackageJson

```ts
get publishablePackageJson(): null | PublicPackageJson
```

Get a version of the Workspace's `package.json` that is meant for publishing.

This strips off `devDependencies` and applies appropriate [`publishConfig`](#publishconfig) values to the root of the `package.json`. This feature enables your monorepo to use source-dependencies and avoid manually building shared Workspaces for every change in order to see them take affect in dependent Workspaces.

To take advantage of this, configure your `package.json` root level to point to source files and the `publishConfig` entries to point to the build location of those entrypoints.

```json collapse={2-4}
{
	"name": "my-module",
	"license": "MIT",
	"type": "module",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/index.d.ts"
	}
}
```

**Returns:** `null` \| [`PublicPackageJson`](#publicpackagejson)  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### scope

```ts
get scope(): string
```

Get module name scope if there is one, eg `@onerepo`

**Returns:** `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### tasks

```ts
get tasks(): Partial<Record<Lifecycle, Tasks>>
```

Get the task configuration as defined in the `onerepo.config.js` file at the root of the Workspace.

**Returns:** `Partial`\<`Record`\<[`Lifecycle`](#lifecycle), [`Tasks`](#tasks)\>\>

If a config does not exist, an empty object will be given.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### version

```ts
get version(): undefined | string
```

**Returns:** `undefined` \| `string`  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

#### Methods

##### getCodeowners()

```ts
getCodeowners(filepath): string[]
```

**Parameters:**

| Parameter  | Type     |
| :--------- | :------- |
| `filepath` | `string` |

**Returns:** `string`[]  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### getTasks()

```ts
getTasks(lifecycle): Required<Tasks>
```

Get a list of Workspace tasks for the given lifecycle

**Parameters:**

| Parameter   | Type     |
| :---------- | :------- |
| `lifecycle` | `string` |

**Returns:** `Required`\<[`Tasks`](#tasks)\>  
**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### relative()

```ts
relative(to): string
```

Get the relative path of an absolute path to the Workspace’s location root

```ts
const relativePath = workspace.relative('/some/absolute/path');
```

**Parameters:**

| Parameter | Type     | Description       |
| :-------- | :------- | :---------------- |
| `to`      | `string` | Absolute filepath |

**Returns:** `string`

Relative path to the workspace’s root location.

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

##### resolve()

```ts
resolve(...pathSegments): string
```

Resolve a full filepath within the Workspace given the path segments. Similar to Node.js's [path.resolve()](https://nodejs.org/dist/latest-v18.x/docs/api/path.html#pathresolvepaths).

```ts
const main = workspace.resolve(workspace.main);
```

**Parameters:**

| Parameter         | Type       | Description                          |
| :---------------- | :--------- | :----------------------------------- |
| ...`pathSegments` | `string`[] | A sequence of paths or path segments |

**Returns:** `string`

Absolute path based on the input path segments

**Source:** [modules/graph/src/Workspace.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Workspace.ts)

---

### DependencyType

```ts
const DependencyType: {
	DEV: 2;
	PEER: 1;
	PROD: 3;
};
```

#### Type declaration

##### DEV

```ts
readonly DEV: 2;
```

Development-only dependency (defined in `devDependencies` keys of `package.json`)

##### PEER

```ts
readonly PEER: 1;
```

Peer dependency (defined in `peerDependencies` key of `package.json`)

##### PROD

```ts
readonly PROD: 3;
```

Production dependency (defined in `dependencies` of `package.json`)

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### DepType

```ts
type DepType: 1 | 2 | 3;
```

Dependency type value.

**See also:**
[`DependencyType`](#dependencytype)

**Source:** [modules/graph/src/Graph.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/graph/src/Graph.ts)

---

### GraphSchemaValidators

```ts
type GraphSchemaValidators: Record<string, Record<string, Schema & {
  $required: boolean;
  } | (workspace, graph) => Schema & {
  $required: boolean;
}>>;
```

Definition for `graph verify` JSON schema validators.

See [“Validating configurations”](/core/graph/#verifying-configurations) for more examples and use cases.

```ts
import type { GraphSchemaValidators } from 'onerepo';

export default {
	'**': {
		'package.json': {
			type: 'object',
			$required: true,
			properties: {
				name: { type: 'string' },
			},
			required: ['name'],
		},
	},
} satisfies GraphSchemaValidators;
```

**Source:** [modules/onerepo/src/core/graph/schema.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/graph/schema.ts)

## Logger

### bufferSubLogger()

<span class="tag danger">Alpha</span>

```ts
bufferSubLogger(step): {
  end: () => Promise<void>;
  logger: Logger;
}
```

Create a new Logger instance that has its output buffered up to a LogStep.

```ts
const step = logger.createStep(name, { writePrefixes: false });
const subLogger = bufferSubLogger(step);
const substep = subLogger.logger.createStep('Sub-step');
substep.warning('This gets buffered');
await substep.end();
await subLogger.end();
await step.en();
```

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `step`    | [`LogStep`](#logstep) |

**Returns:** ```ts
{
end: () => Promise<void>;
logger: Logger;
}

````

##### end

```ts
end: () => Promise<void>;
````

**Returns:** `Promise`\<`void`\>

##### logger

```ts
logger: Logger;
```

**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

---

### getLogger()

```ts
getLogger(opts?): Logger
```

This gets the logger singleton for use across all of oneRepo and its commands.

Available directly as [`HandlerExtra`](#handlerextra) on [`Handler`](#handlercommandargv) functions:

```ts
export const handler: Handler = (argv, { logger }) => {
	logger.log('Hello!');
};
```

**Parameters:**

| Parameter | Type                                           |
| :-------- | :--------------------------------------------- |
| `opts`?   | `Partial`\<[`LoggerOptions`](#loggeroptions)\> |

**Returns:** [`Logger`](#logger)  
**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

---

### stepWrapper()

```ts
stepWrapper<T>(options, fn): Promise<T>
```

For cases where multiple processes need to be completed, but should be joined under a single [`LogStep`](#logstep) to avoid too much noisy output, this safely wraps an asynchronous function and handles step creation and completion, unless a `step` override is given.

```ts
export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: 'Step fallback name' }, (step) => {
		return; // do some work
	});
}
```

**Type parameters:**

| Type parameter |
| :------------- |
| `T`            |

**Parameters:**

| Parameter       | Type                         |
| :-------------- | :--------------------------- |
| `options`       | `Object`                     |
| `options.name`  | `string`                     |
| `options.step`? | [`LogStep`](#logstep)        |
| `fn`            | (`step`) => `Promise`\<`T`\> |

**Returns:** `Promise`\<`T`\>  
**Source:** [modules/logger/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/index.ts)

---

### Logger

The oneRepo logger helps build commands and capture output from spawned subprocess in a way that's both delightful to the end user and includes easy to scan and follow output.

All output will be redirected from `stdout` to `stderr` to ensure order of output and prevent confusion of what output can be piped and written to files.

If the current terminal is a TTY, output will be buffered and asynchronous steps will animated with a progress logger.

See [`HandlerExtra`](#handlerextra) for access the the global Logger instance.

#### Accessors

##### captureAll

```ts
get captureAll(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasError

```ts
get hasError(): boolean
```

Whether or not an error has been sent to the logger or any of its steps. This is not necessarily indicative of uncaught thrown errors, but solely on whether `.error()` has been called in the `Logger` or any `Step` instance.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasInfo

```ts
get hasInfo(): boolean
```

Whether or not an info message has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasLog

```ts
get hasLog(): boolean
```

Whether or not a log message has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### hasWarning

```ts
get hasWarning(): boolean
```

Whether or not a warning has been sent to the logger or any of its steps.

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### verbosity

```ts
get verbosity(): Verbosity
```

Get the logger's verbosity level

```ts
set verbosity(value): void
```

Recursively applies the new verbosity to the logger and all of its active steps.

**Parameters:**

| Parameter | Type                        |
| :-------- | :-------------------------- |
| `value`   | [`Verbosity`](#verbosity-2) |

**Returns:** [`Verbosity`](#verbosity-2)  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### writable

```ts
get writable(): boolean
```

**Returns:** `boolean`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Methods

##### createStep()

```ts
createStep(name, opts?): LogStep
```

Create a sub-step, [`LogStep`](#logstep), for the logger. This and any other step will be tracked and required to finish before exit.

```ts
const step = logger.createStep('Do fun stuff');
// do some work
await step.end();
```

**Parameters:**

| Parameter             | Type      | Description                                                                   |
| :-------------------- | :-------- | :---------------------------------------------------------------------------- |
| `name`                | `string`  | The name to be written and wrapped around any output logged to this new step. |
| `opts`?               | `Object`  | -                                                                             |
| `opts.writePrefixes`? | `boolean` | -                                                                             |

**Returns:** [`LogStep`](#logstep)  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### pause()

```ts
pause(): void
```

When the terminal is a TTY, steps are automatically animated with a progress indicator. There are times when it's necessary to stop this animation, like when needing to capture user input from `stdin`. Call the `pause()` method before requesting input and [`logger.unpause()`](#unpause) when complete.

This process is also automated by the [`run()`](#run-1) function when `stdio` is set to `pipe`.

```ts
logger.pause();
// capture input
logger.unpause();
```

**Returns:** `void`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### unpause()

```ts
unpause(): void
```

Unpause the logger and resume writing buffered logs to the output stream. See [`logger.pause()`](#pause-1) for more information.

**Returns:** `void`  
**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

#### Logging

##### debug()

```ts
debug(contents): void
```

Extra debug logging when verbosity greater than or equal to 4.

```ts
logger.debug('Log this content when verbosity is >= 4');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged debug information:

```ts
logger.debug(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`debug()`](#debug) This is a pass-through for the main step’s [`debug()`](#debug) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### error()

```ts
error(contents): void
```

Log an error. This will cause the root logger to include an error and fail a command.

```ts
logger.error('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged error:

```ts
logger.error(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`error()`](#error) This is a pass-through for the main step’s [`error()`](#error) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### info()

```ts
info(contents): void
```

Should be used to convey information or instructions through the log, will log when verbositu >= 1

```ts
logger.info('Log this content when verbosity is >= 1');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.info(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`info()`](#info) This is a pass-through for the main step’s [`info()`](#info) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### log()

```ts
log(contents): void
```

General logging information. Useful for light informative debugging. Recommended to use sparingly.

```ts
logger.log('Log this content when verbosity is >= 3');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged information:

```ts
logger.log(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`log()`](#log) This is a pass-through for the main step’s [`log()`](#log) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### timing()

```ts
timing(start, end): void
```

Log timing information between two [Node.js performance mark names](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performancemarkname-options).

**Parameters:**

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `start`   | `string` | A `PerformanceMark` entry name |
| `end`     | `string` | A `PerformanceMark` entry name |

**Returns:** `void`  
**See also:**
[`timing()`](#timing) This is a pass-through for the main step’s [`timing()`](#timing) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

##### warn()

```ts
warn(contents): void
```

Log a warning. Does not have any effect on the command run, but will be called out.

```ts
logger.warn('Log this content when verbosity is >= 2');
```

If a function with zero arguments is passed, the function will be executed before writing. This is helpful for avoiding extra work in the event that the verbosity is not actually high enough to render the logged warning:

```ts
logger.warn(() => bigArray.map((item) => item.name));
```

**Parameters:**

| Parameter  | Type      | Description                                                          |
| :--------- | :-------- | :------------------------------------------------------------------- |
| `contents` | `unknown` | Any value that can be converted to a string for writing to `stderr`. |

**Returns:** `void`  
**See also:**
[`warn()`](#warn) This is a pass-through for the main step’s [`warn()`](#warn) method.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

---

### LoggerOptions

```ts
type LoggerOptions: {
  captureAll: boolean;
  stream: Writable | LogStep;
  verbosity: Verbosity;
};
```

#### Type declaration

##### captureAll?

<span class="tag danger">Experimental</span>

```ts
optional captureAll: boolean;
```

##### stream?

```ts
optional stream: Writable | LogStep;
```

Advanced – override the writable stream in order to pipe logs elsewhere. Mostly used for dependency injection for `@onerepo/test-cli`.

##### verbosity

```ts
verbosity: Verbosity;
```

Control how much and what kind of output the Logger will provide.

**Source:** [modules/logger/src/Logger.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts)

---

### Verbosity

```ts
type Verbosity:
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5;
```

Control the verbosity of the log output

| Value  | What        | Description                                      |
| ------ | ----------- | ------------------------------------------------ |
| `<= 0` | Silent      | No output will be read or written.               |
| `>= 1` | Error, Info |                                                  |
| `>= 2` | Warnings    |                                                  |
| `>= 3` | Log         |                                                  |
| `>= 4` | Debug       | `logger.debug()` will be included                |
| `>= 5` | Timing      | Extra performance timing metrics will be written |

**Source:** [modules/logger/src/types.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/types.ts)

## Package management

### getLockfile()

```ts
getLockfile(cwd): string | null
```

Get the absolute path for the package manager's lock file for this repository.

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `cwd`     | `string` |

**Returns:** `string` \| `null`  
**Source:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

---

### getPackageManager()

```ts
getPackageManager(type): PackageManager
```

Get the [`PackageManager`](#packagemanager-1) for the given package manager type (NPM, PNPm, or Yarn)

**Parameters:**

| Parameter | Type                            |
| :-------- | :------------------------------ |
| `type`    | `"yarn"` \| `"pnpm"` \| `"npm"` |

**Returns:** [`PackageManager`](#packagemanager-1)  
**Source:** [modules/package-manager/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/index.ts)

---

### getPackageManagerName()

```ts
getPackageManagerName(cwd, fromPkgJson?): "npm" | "pnpm" | "yarn"
```

Get the package manager for the current working directory with _some_ confidence

**Parameters:**

| Parameter      | Type     | Description                                                                   |
| :------------- | :------- | :---------------------------------------------------------------------------- |
| `cwd`          | `string` | Current working directory. Should be the root of the module/repository.       |
| `fromPkgJson`? | `string` | Value as defined in a package.json file, typically the `packageManager` value |

**Returns:** `"npm"` \| `"pnpm"` \| `"yarn"`  
**Source:** [modules/package-manager/src/get-package-manager.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/get-package-manager.ts)

---

### PackageManager

Implementation details for all package managers. This interface defines a subset of common methods typically needed when interacting with a monorepo and its dependency [`Graph`](#graph) & [`Workspace`](#workspace)s.

#### Methods

##### add()

```ts
add(packages, opts?): Promise<void>
```

Add one or more packages from external registries

**Parameters:**

| Parameter   | Type                   | Description                                                                      |
| :---------- | :--------------------- | :------------------------------------------------------------------------------- |
| `packages`  | `string` \| `string`[] | One or more packages, by name and/or `'name@version'`.                           |
| `opts`?     | `Object`               | Various options to pass while installing the packages                            |
| `opts.dev`? | `boolean`              | Set to true to install as a `devDependency`.<br /><br />**Default**<br />`false` |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### batch()

```ts
batch(processes): Promise<(Error | [string, string])[]>
```

Batch commands from npm packages as a batch of subprocesses using the package manager. Alternative to batching with `npm exec` and compatible APIs.

**Parameters:**

| Parameter   | Type                    |
| :---------- | :---------------------- |
| `processes` | [`RunSpec`](#runspec)[] |

**Returns:** `Promise`\<(`Error` \| [`string`, `string`])[]\>  
**See also:**
[`batch`](#batch) for general subprocess batching.

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### dedupe()

```ts
dedupe(): Promise<void>
```

Reduce duplication in the package tree by checking overlapping ranges.

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### info()

```ts
info(name, opts?): Promise<null | NpmInfo>
```

Get standard information about a package

**Parameters:**

| Parameter | Type                               |
| :-------- | :--------------------------------- |
| `name`    | `string`                           |
| `opts`?   | `Partial`\<[`RunSpec`](#runspec)\> |

**Returns:** `Promise`\<`null` \| [`NpmInfo`](#npminfo)\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### install()

```ts
install(cwd?): Promise<string>
```

Install current dependencies as listed in the package manager's lock file

**Parameters:**

| Parameter | Type     |
| :-------- | :------- |
| `cwd`?    | `string` |

**Returns:** `Promise`\<`string`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### loggedIn()

```ts
loggedIn(opts?): Promise<boolean>
```

Check if the current user is logged in to the external registry

**Parameters:**

| Parameter        | Type     | Description                                                                                                                                         |
| :--------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`?          | `Object` | -                                                                                                                                                   |
| `opts.registry`? | `string` | The base URL of your NPM registry. PNPM and NPM ignore scope and look up per-registry.                                                              |
| `opts.scope`?    | `string` | When using Yarn, lookups are done by registry configured by scope. This value must be included if you have separate registries for separate scopes. |

**Returns:** `Promise`\<`boolean`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### publish()

```ts
publish<T>(opts): Promise<void>
```

Publish Workspaces to the external registry

**Type parameters:**

| Type parameter                                      |
| :-------------------------------------------------- |
| `T` extends [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter         | Type                         | Description                                                                                                                                                                   |
| :---------------- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`            | `Object`                     | -                                                                                                                                                                             |
| `opts.access`?    | `"restricted"` \| `"public"` | Set the registry access level for the package<br /><br />**Default**<br />inferred from Workspaces `publishConfig.access` or `'public'`                                       |
| `opts.cwd`?       | `string`                     | Command working directory. Defaults to the repository root.                                                                                                                   |
| `opts.otp`?       | `string`                     | This is a one-time password from a two-factor authenticator.                                                                                                                  |
| `opts.tag`?       | `string`                     | If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag.<br /><br />**Default**<br />`'latest'`                      |
| `opts.workspaces` | `T`[]                        | Workspaces to publish. If not provided or empty array, only the given Workspace at `cwd` will be published. This type is generally compatible with [`Workspace`](#workspace). |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### publishable()

```ts
publishable<T>(workspaces): Promise<T[]>
```

Filter Workspaces to the set of those that are actually publishable. This will check both whether the package is not marked as "private" and if the current version is not in the external registry.

**Type parameters:**

| Type parameter                                      |
| :-------------------------------------------------- |
| `T` extends [`MinimalWorkspace`](#minimalworkspace) |

**Parameters:**

| Parameter    | Type  | Description                                           |
| :----------- | :---- | :---------------------------------------------------- |
| `workspaces` | `T`[] | List of compatible [`Workspace`](#workspace) objects. |

**Returns:** `Promise`\<`T`[]\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### remove()

```ts
remove(packages): Promise<void>
```

Remove one or more packages.

**Parameters:**

| Parameter  | Type                   | Description                   |
| :--------- | :--------------------- | :---------------------------- |
| `packages` | `string` \| `string`[] | One or more packages, by name |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

##### run()

```ts
run(opts): Promise<[string, string]>
```

Run a command from an npm package as a subprocess using the package manager. Alternative to `npm exec` and compatible APIs.

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `opts`    | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<[`string`, `string`]\>  
**See also:**
[`batch`](#batch) for general subprocess running.

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### MinimalWorkspace

```ts
type MinimalWorkspace: {
  location: string;
  name: string;
  private: boolean;
  version: string;
};
```

#### Type declaration

##### location?

```ts
optional location: string;
```

##### name

```ts
name: string;
```

##### private?

```ts
optional private: boolean;
```

##### version?

```ts
optional version: string;
```

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

---

### NpmInfo

```ts
type NpmInfo: {
  dependencies: Record<string, string>;
  dist-tags: {
   [key: string]: string;   latest: string;
  };
  homepage: string;
  license: string;
  name: string;
  version: string;
  versions: string[];
};
```

#### Type declaration

##### dependencies

```ts
dependencies: Record<string, string>;
```

##### dist-tags

```ts
dist-tags: {
[key: string]: string;   latest: string;
};
```

###### Index signature

\[`key`: `string`\]: `string`

##### dist-tags.latest

```ts
latest: string;
```

##### homepage

```ts
homepage: string;
```

##### license

```ts
license: string;
```

##### name

```ts
name: string;
```

##### version

```ts
version: string;
```

##### versions

```ts
versions: string[];
```

**Source:** [modules/package-manager/src/methods.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/methods.ts)

## Plugins

### Plugin

```ts
type Plugin: PluginObject | (config, graph) => PluginObject;
```

**Source:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

---

### PluginObject

```ts
type PluginObject: {
  shutdown: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
  startup: (argv) => Promise<void> | void;
  yargs: (yargs, visitor) => Yargs;
};
```

#### Type declaration

##### shutdown?

```ts
optional shutdown: (argv) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;
```

Runs just before the application process is exited. Allows returning data that will be merged with all other shutdown handlers.

**Parameters:**

| Parameter | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `argv`    | [`Argv`](#argvcommandargv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`Record`\<`string`, `unknown`\> \| `void`\> \| `Record`\<`string`, `unknown`\> \| `void`

##### startup?

```ts
optional startup: (argv) => Promise<void> | void;
```

Runs before any and all commands after argument parsing. This is similar to global Yargs middleware, but guaranteed to have the fully resolved and parsed arguments.

Use this function for setting up global even listeners like `PerformanceObserver`, `process` events, etc.

**Parameters:**

| Parameter | Type                                                        |
| :-------- | :---------------------------------------------------------- |
| `argv`    | [`Argv`](#argvcommandargv)\<[`DefaultArgv`](#defaultargv)\> |

**Returns:** `Promise`\<`void`\> \| `void`

##### yargs?

```ts
optional yargs: (yargs, visitor) => Yargs;
```

A function that is called with the CLI's `yargs` object and a visitor.
It is important to ensure every command passed through the `visitor` to enable all of the features of oneRepo. Without this step, you will not have access to the Workspace Graph, affected list, and much more.

**Parameters:**

| Parameter | Type                                                    |
| :-------- | :------------------------------------------------------ |
| `yargs`   | `Yargs`                                                 |
| `visitor` | `NonNullable`\<`RequireDirectoryOptions`\[`"visit"`\]\> |

**Returns:** `Yargs`  
**Source:** [modules/onerepo/src/types/plugin.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/types/plugin.ts)

## Subprocess

### batch()

```ts
batch(processes, options?): Promise<([string, string] | Error)[]>
```

Batch multiple subprocesses, similar to `Promise.all`, but only run as many processes at a time fulfilling N-1 cores. If there are more processes than cores, as each process finishes, a new process will be picked to run, ensuring maximum CPU usage at all times.

If any process throws a `SubprocessError`, this function will reject with a `BatchError`, but only after _all_ processes have completed running.

Most oneRepo commands will consist of at least one [`run()`](#run-1) or [`batch()`](#batch-1) processes.

```ts
const processes: Array<RunSpec> = [
	{ name: 'Say hello', cmd: 'echo', args: ['"hello"'] },
	{ name: 'Say world', cmd: 'echo', args: ['"world"'] },
];

const results = await batch(processes);

expect(results).toEqual([
	['hello', ''],
	['world', ''],
]);
```

**Parameters:**

| Parameter   | Type                                                   |
| :---------- | :----------------------------------------------------- |
| `processes` | ([`RunSpec`](#runspec) \| [`PromiseFn`](#promisefn))[] |
| `options`?  | [`BatchOptions`](#batchoptions)                        |

**Returns:** `Promise`\<([`string`, `string`] \| `Error`)[]\>

#### Throws

[`BatchError`](#batcherror) An object that includes a list of all of the [`SubprocessError`](#subprocesserror)s thrown.

**See also:**
[`PackageManager.batch`](#batch) to safely batch executables exposed from third party modules.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### run()

```ts
run(options): Promise<[string, string]>
```

Spawn a process and capture its `stdout` and `stderr` through a Logger Step. Most oneRepo commands will consist of at least one [`run()` ](#run-1) or [`batch()`](#batch-1) processes.

The `run()` command is an async wrapper around Node.js’s [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) and has a very similar API, with some additions. This command will buffer and catch all `stdout` and `stderr` responses.

```ts
await run({
	name: 'Do some work',
	cmd: 'echo',
	args: ['"hello!"'],
});
```

**Skipping failures:**

If a subprocess fails when called through `run()`, a [`SubprocessError`](#subprocesserror) will be thrown. Some third-party tooling will exit with error codes as an informational tool. While this is discouraged, there’s nothing we can do about how they’ve been chosen to work. To prevent throwing errors, but still act on the `stderr` response, include the `skipFailures` option:

```ts
const [stdout, stderr] = await run({
	name: 'Run dry',
	cmd: 'echo',
	args: ['"hello"'],
	skipFailures: true,
});

logger.error(stderr);
```

**Dry-run:**

By default, `run()` will respect oneRepo’s `--dry-run` option (see [`DefaultArgv`](#defaultargv), `process.env.ONEREPO_DRY_RUN`). When set, the process will not be spawned, but merely log information about what would run instead. To continue running a command, despite the `--dry-run` option being set, use `runDry: true`:

```ts
await run({
	name: 'Run dry',
	cmd: 'echo',
	args: ['"hello"'],
	runDry: true,
});
```

**Parameters:**

| Parameter | Type                  |
| :-------- | :-------------------- |
| `options` | [`RunSpec`](#runspec) |

**Returns:** `Promise`\<[`string`, `string`]\>

A promise with an array of `[stdout, stderr]`, as captured from the command run.

#### Throws

[`SubprocessError`](#subprocesserror) if not `skipFailures` and the spawned process does not exit cleanly (with code `0`)

**See also:**
[`PackageManager.run`](#run) to safely run executables exposed from third party modules.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### runTasks()

<span class="tag danger">Alpha</span>

```ts
runTasks(
   lifecycle,
   args,
   graph,
logger?): Promise<void>
```

Run Lifecycle tasks in commands other than the `one tasks` command. Use this function when you have a command triggering a Lifecycle in non-standard ways.

```ts
await runTasks('pre-publish', ['-w', 'my-workspace'], graph);
```

**Parameters:**

| Parameter   | Type                      | Description                                                                                        |
| :---------- | :------------------------ | :------------------------------------------------------------------------------------------------- |
| `lifecycle` | [`Lifecycle`](#lifecycle) | The individual Lifecycle to trigger.                                                               |
| `args`      | `string`[]                | Array of string arguments as if passed in from the command-line.                                   |
| `graph`     | [`Graph`](#graph)         | The current repository [Graph](#graph).                                                            |
| `logger`?   | [`Logger`](#logger)       | Optional [Logger](#logger) instance. Defaults to the current `Logger` (usually there is only one). |

**Returns:** `Promise`\<`void`\>  
**Source:** [modules/onerepo/src/core/tasks/run-tasks.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/onerepo/src/core/tasks/run-tasks.ts)

---

### start()

```ts
start(options): ChildProcess
```

Start a subprocess. For use when control over watching the stdout and stderr or long-running processes that are not expected to complete without SIGINT/SIGKILL.

**Parameters:**

| Parameter | Type                                                    |
| :-------- | :------------------------------------------------------ |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"name"` \| `"runDry"`\> |

**Returns:** `ChildProcess`  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### sudo()

```ts
sudo(options): Promise<[string, string]>
```

This function is similar to `run`, but can request and run with elevated `sudo` permissions. This function should not be used unless you absolutely _know_ that you will need to spawn an executable with elevated permissions.

This function will first check if `sudo` permissions are valid. If not, the logger will warn the user that sudo permissions are being requested and properly pause the animated logger while the user enters their password directly through `stdin`. If permissions are valid, no warning will be given.

```ts
await sudo({
	name: 'Change permissions',
	cmd: 'chmod',
	args: ['a+x', '/usr/bin/thing'],
	reason: 'When prompted, please type your password and hit [RETURN] to allow `thing` to be run later',
});
```

**Parameters:**

| Parameter | Type                                                                 |
| :-------- | :------------------------------------------------------------------- |
| `options` | `Omit`\<[`RunSpec`](#runspec), `"opts"`\> & \{ `reason`: `string`; } |

**Returns:** `Promise`\<[`string`, `string`]\>  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### BatchError

#### Extends

- `Error`

#### Constructors

##### new BatchError(errors, options)

```ts
new BatchError(errors, options?): BatchError
```

**Parameters:**

| Parameter  | Type                                                  |
| :--------- | :---------------------------------------------------- |
| `errors`   | (`string` \| [`SubprocessError`](#subprocesserror))[] |
| `options`? | `ErrorOptions`                                        |

**Returns:** [`BatchError`](#batcherror)

###### Overrides

`Error.constructor`

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

| Property             | Modifier | Type                                                   | Description                                                                                                                        | Inherited from            |
| :------------------- | :------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| `cause?`             | `public` | `unknown`                                              | -                                                                                                                                  | `Error.cause`             |
| `errors`             | `public` | (`string` \| [`SubprocessError`](#subprocesserror))[]  | -                                                                                                                                  | -                         |
| `message`            | `public` | `string`                                               | -                                                                                                                                  | `Error.message`           |
| `name`               | `public` | `string`                                               | -                                                                                                                                  | `Error.name`              |
| `prepareStackTrace?` | `static` | (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any` | Optional override for formatting stack traces<br /><br />**See**<br />https://v8.dev/docs/stack-trace-api#customizing-stack-traces | `Error.prepareStackTrace` |
| `stack?`             | `public` | `string`                                               | -                                                                                                                                  | `Error.stack`             |
| `stackTraceLimit`    | `static` | `number`                                               | -                                                                                                                                  | `Error.stackTraceLimit`   |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

**Parameters:**

| Parameter         | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

**Returns:** `void`

###### Inherited from

`Error.captureStackTrace`

**Source:** node_modules/@types/node/globals.d.ts:21

---

### SubprocessError

#### Extends

- `Error`

#### Constructors

##### new SubprocessError(message, options)

```ts
new SubprocessError(message, options?): SubprocessError
```

**Parameters:**

| Parameter  | Type           |
| :--------- | :------------- |
| `message`  | `string`       |
| `options`? | `ErrorOptions` |

**Returns:** [`SubprocessError`](#subprocesserror)

###### Overrides

`Error.constructor`

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

#### Properties

| Property             | Modifier | Type                                                   | Description                                                                                                                        | Inherited from            |
| :------------------- | :------- | :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| `cause?`             | `public` | `unknown`                                              | -                                                                                                                                  | `Error.cause`             |
| `message`            | `public` | `string`                                               | -                                                                                                                                  | `Error.message`           |
| `name`               | `public` | `string`                                               | -                                                                                                                                  | `Error.name`              |
| `prepareStackTrace?` | `static` | (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any` | Optional override for formatting stack traces<br /><br />**See**<br />https://v8.dev/docs/stack-trace-api#customizing-stack-traces | `Error.prepareStackTrace` |
| `stack?`             | `public` | `string`                                               | -                                                                                                                                  | `Error.stack`             |
| `stackTraceLimit`    | `static` | `number`                                               | -                                                                                                                                  | `Error.stackTraceLimit`   |

#### Methods

##### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

**Parameters:**

| Parameter         | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

**Returns:** `void`

###### Inherited from

`Error.captureStackTrace`

**Source:** node_modules/@types/node/globals.d.ts:21

---

### BatchOptions

```ts
type BatchOptions: {
  maxParallel: number;
};
```

Options for running [`batch()`](#batch-1) subprocesses.

#### Type declaration

##### maxParallel?

```ts
optional maxParallel: number;
```

The absolute maximum number of subprocesses to batch. This amount will always be limited by the number of CPUs/cores available on the current machine.

**Default:** `deterministic` Number of CPUs - 1  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### PromiseFn

```ts
type PromiseFn: () => Promise<[string, string]>;
```

**Returns:** `Promise`\<[`string`, `string`]\>  
**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

---

### RunSpec

```ts
type RunSpec: {
  args: string[];
  cmd: string;
  name: string;
  opts: SpawnOptions;
  runDry: boolean;
  skipFailures: boolean;
  step: LogStep;
};
```

The core configuration for [`run`](#run-1), [`start`](#start), [`sudo`](#sudo), and [`batch`](#batch-1) subprocessing.

#### Type declaration

##### args?

```ts
optional args: string[];
```

Arguments to pass to the executable. All arguments must be separate string entries.

Beware that some commands have different ways of parsing arguments.

Typically, it is safest to have separate entries in the `args` array for the flag and its value:

```
args: ['--some-flag', 'some-flags-value']
```

However, if an argument parser is implemented in a non-standard way, the flag and its value may need to be a single entry:

```
args: ['--some-flag=some-flags-value']
```

##### cmd

```ts
cmd: string;
```

The command to run. This should be an available executable or path to an executable.

##### name

```ts
name: string;
```

A friendly name for the Step in log output.

##### opts?

```ts
optional opts: SpawnOptions;
```

See the [Node.js `child_process.spawn()` documentation](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) for available options.

##### runDry?

```ts
optional runDry: boolean;
```

Skip the `--dry-run` check and run this command anyway.

##### skipFailures?

```ts
optional skipFailures: boolean;
```

Prevents throwing a [`SubprocessError`](#subprocesserror) in the event of the process failing and exiting with an unclean state.

##### step?

```ts
optional step: LogStep;
```

Pass a custom [`LogStep`](#logstep) to bundle this process input & output into another step instead of creating a new one.

**Source:** [modules/subprocess/src/index.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts)

## package.json

### getPublishablePackageJson()

```ts
getPublishablePackageJson(input): PublicPackageJson
```

Return a deep copy of a `package.json` suitabkle for publishing. Moves all non-standard `publishConfig` keys to the root of the `package.json` and deletes `devDependencies`.

**Parameters:**

| Parameter | Type                                      |
| :-------- | :---------------------------------------- |
| `input`   | [`PublicPackageJson`](#publicpackagejson) |

**Returns:** [`PublicPackageJson`](#publicpackagejson)  
**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### BasePackageJson

```ts
type BasePackageJson: {
  alias: string[];
  author: string | Person;
  bin: string | Record<string, string>;
  bugs: {
     email: string;
     url: string;
  };
  bundleDependencies: string[];
  contributors: (Person | string)[];
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
  exports: Record<string, string | {
     default: string;
     import: string;
     require: string;
     types: string;
  }>;
  files: string[];
  homepage: string;
  keywords: string[];
  license: string;
  main: string;
  name: string;
  optionalDependencies: string[];
  os: string[];
  overrides: Record<string, string>;
  packageManager: string;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: Record<string, {
     optional: boolean;
  }>;
  scripts: Record<string, string>;
  version: string;
};
```

#### Type declaration

##### alias?

```ts
optional alias: string[];
```

Enable's the [`Graph`](#graph) to look up [`Workspace`](#workspace)s by shorter names or common [`aliases`](#aliases) used by teams. This enables much short command-line execution. See [`Graph.getByName`](#getbyname) and [`Graph.getAllByName`](#getallbyname).

##### author?

```ts
optional author: string | Person;
```

##### bin?

```ts
optional bin: string | Record<string, string>;
```

##### bugs?

```ts
optional bugs: {
  email: string;
  url: string;
};
```

##### bugs.email?

```ts
optional email: string;
```

##### bugs.url?

```ts
optional url: string;
```

##### bundleDependencies?

```ts
optional bundleDependencies: string[];
```

##### contributors?

```ts
optional contributors: (Person | string)[];
```

##### dependencies?

```ts
optional dependencies: Record<string, string>;
```

##### description?

```ts
optional description: string;
```

##### devDependencies?

```ts
optional devDependencies: Record<string, string>;
```

##### engines?

```ts
optional engines: Record<string, string>;
```

##### exports?

```ts
optional exports: Record<string, string | {
  default: string;
  import: string;
  require: string;
  types: string;
}>;
```

##### files?

```ts
optional files: string[];
```

##### homepage?

```ts
optional homepage: string;
```

##### keywords?

```ts
optional keywords: string[];
```

##### license?

```ts
optional license: string;
```

##### main?

```ts
optional main: string;
```

##### name

```ts
name: string;
```

The full name for the [`Workspace`](#workspace). This will be used within the package manager and publishable registry.

##### optionalDependencies?

```ts
optional optionalDependencies: string[];
```

##### os?

```ts
optional os: string[];
```

##### overrides?

```ts
optional overrides: Record<string, string>;
```

##### packageManager?

```ts
optional packageManager: string;
```

##### peerDependencies?

```ts
optional peerDependencies: Record<string, string>;
```

##### peerDependenciesMeta?

```ts
optional peerDependenciesMeta: Record<string, {
  optional: boolean;
}>;
```

##### scripts?

```ts
optional scripts: Record<string, string>;
```

##### version?

```ts
optional version: string;
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PackageJson

```ts
type PackageJson: PrivatePackageJson | PublicPackageJson;
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### Person

```ts
type Person: {
  email: string;
  name: string;
  url: string;
};
```

#### Type declaration

##### email?

```ts
optional email: string;
```

##### name?

```ts
optional name: string;
```

##### url?

```ts
optional url: string;
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PrivatePackageJson

```ts
type PrivatePackageJson: {
  license: "UNLICENSED";
  private: true;
  workspaces: string[];
  } & BasePackageJson;
```

#### Type declaration

##### license?

```ts
optional license: "UNLICENSED";
```

##### private

```ts
private: true;
```

##### workspaces?

```ts
optional workspaces: string[];
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PublicPackageJson

```ts
type PublicPackageJson: {
  private: false;
  publishConfig: PublishConfig;
  workspaces: never;
  } & BasePackageJson;
```

#### Type declaration

##### private?

```ts
optional private: false;
```

##### publishConfig?

```ts
optional publishConfig: PublishConfig;
```

##### workspaces?

```ts
optional workspaces: never;
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

---

### PublishConfig

```ts
type PublishConfig: {
[key: typeof publishConfigKeep[number]]: unknown;   bin: string | Record<string, string>;
  exports: Record<string, string | {
     default: string;
     import: string;
     require: string;
     types: string;
  }>;
  main: string;
  module: string;
  typings: string;
};
```

The `publishConfig` should follow [NPM's guidelines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig), apart from the possible defined extra keys here. Anything defined here will be merged back to the root of the `package.json` at publish time.

Use these keys to help differentiate between your repository's source-dependency entrypoints vs published module entrypoints.

```json collapse={2-4}
{
	"name": "my-module",
	"license": "MIT",
	"type": "module",
	"main": "./src/index.ts",
	"publishConfig": {
		"access": "public",
		"main": "./dist/index.js",
		"typings": "./dist/index.d.ts"
	}
}
```

#### Index signature

\[`key`: _typeof_ `publishConfigKeep`\[`number`\]\]: `unknown`

#### Type declaration

##### bin?

```ts
optional bin: string | Record<string, string>;
```

##### exports?

```ts
optional exports: Record<string, string | {
  default: string;
  import: string;
  require: string;
  types: string;
}>;
```

##### main?

```ts
optional main: string;
```

##### module?

```ts
optional module: string;
```

##### typings?

```ts
optional typings: string;
```

**Source:** [modules/package-manager/src/package-json.ts](https://github.com/paularmstrong/onerepo/blob/main/modules/package-manager/src/package-json.ts)

<!-- end-onerepo-sentinel -->
