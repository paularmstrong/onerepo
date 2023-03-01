---
title: 'API: interfaces/RunSpec'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / RunSpec

# Interface: RunSpec

## Properties

### args

`Optional` **args**: `string`[]

Arguments to pass to the executable

#### Defined in

[modules/subprocess/src/index.ts:21](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L21)

---

### cmd

**cmd**: `string`

The command to run. Thsi should be an available executable or path to an executable.

#### Defined in

[modules/subprocess/src/index.ts:17](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L17)

---

### name

**name**: `string`

A friendly name for the Step

#### Defined in

[modules/subprocess/src/index.ts:13](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L13)

---

### opts

`Optional` **opts**: `SpawnOptions`

#### Defined in

[modules/subprocess/src/index.ts:22](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L22)

---

### runDry

`Optional` **runDry**: `boolean`

#### Defined in

[modules/subprocess/src/index.ts:23](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L23)

---

### skipFailures

`Optional` **skipFailures**: `boolean`

#### Defined in

[modules/subprocess/src/index.ts:25](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L25)

---

### step

`Optional` **step**: [`Step`](/docs/core/api/classes/Step/)

#### Defined in

[modules/subprocess/src/index.ts:24](https://github.com/paularmstrong/onerepo/blob/main/modules/subprocess/src/index.ts#L24)
