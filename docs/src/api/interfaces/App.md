---
title: 'API: interfaces/App'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / App

# Interface: App

Command-line application returned from setup

## Properties

### run

**run**: () => `Promise`<`void`\>

#### Type declaration

(): `Promise`<`void`\>

Run the command handler.

##### Returns

`Promise`<`void`\>

#### Defined in

[modules/core/src/index.ts:115](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L115)

---

### yargs

**yargs**: [`Yargs`](/docs/core/api/public/#yargs)<[`DefaultArgv`](/docs/core/api/public/#defaultargv)\>

(advanced) Further extend the yargs object before running the command handler.

#### Defined in

[modules/core/src/index.ts:111](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L111)
