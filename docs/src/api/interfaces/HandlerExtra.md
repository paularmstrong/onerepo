---
title: 'API: interfaces/HandlerExtra'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / HandlerExtra

# Interface: HandlerExtra

## Properties

### getAffected

**getAffected**: (`opts?`: [`GetterOptions`](/docs/core/api/public/#getteroptions)) => `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Type declaration

(`opts?`): `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

Get the affected workspaces based on the current state of the repository.

##### Parameters

| Name    | Type                                                    |
| :------ | :------------------------------------------------------ |
| `opts?` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

##### Returns

`Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Defined in

[modules/types/src/index.ts:60](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L60)

---

### getFilepaths

**getFilepaths**: (`opts?`: [`GetterOptions`](/docs/core/api/public/#getteroptions)) => `Promise`<`string`[]\>

#### Type declaration

(`opts?`): `Promise`<`string`[]\>

Get the affected filepaths based on the current inputs and state of the repository.

##### Parameters

| Name    | Type                                                    |
| :------ | :------------------------------------------------------ |
| `opts?` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

##### Returns

`Promise`<`string`[]\>

#### Defined in

[modules/types/src/index.ts:64](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L64)

---

### getWorkspaces

**getWorkspaces**: (`opts?`: [`GetterOptions`](/docs/core/api/public/#getteroptions)) => `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Type declaration

(`opts?`): `Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

Get the affected workspaces based on the current inputs and the state of the repository.
This function differs from `getAffected` in that it respects input arguments provided by
`withWorkspaces`, `withFiles` and `withAffected`.

##### Parameters

| Name    | Type                                                    |
| :------ | :------------------------------------------------------ |
| `opts?` | [`GetterOptions`](/docs/core/api/public/#getteroptions) |

##### Returns

`Promise`<[`Workspace`](/docs/core/api/classes/Workspace/)[]\>

#### Defined in

[modules/types/src/index.ts:70](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L70)

---

### graph

**graph**: [`Repository`](/docs/core/api/classes/Repository/)

The Repository Graph

#### Defined in

[modules/types/src/index.ts:74](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L74)

---

### logger

**logger**: [`Logger`](/docs/core/api/classes/Logger/)

Standard logger. This should _always_ be used in place of console.log unless you have
a specific need to write to standard out differently.

#### Defined in

[modules/types/src/index.ts:79](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L79)
