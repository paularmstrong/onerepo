---
title: 'API: interfaces/DefaultArguments'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / DefaultArguments

# Interface: DefaultArguments

Always present in Builder and Handler arguments.

## Properties

### $0

**$0**: `string`

The script name or node command. Similar to `process.argv[1]`

#### Defined in

[modules/types/src/index.ts:93](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L93)

---

### --

**--**: `string`[]

Any content that comes after " -- " gets populated here. These are useful for spreading through to spawned `run` functions that may take extra options that you don't want to enumerate and validate.

#### Defined in

[modules/types/src/index.ts:97](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L97)

---

### \_

**\_**: (`string` \| `number`)[]

Positionals / non-option arguments. These will only be filled if you include `.positional()` or `.strictCommands(false)` in your `Builder`.

#### Defined in

[modules/types/src/index.ts:89](https://github.com/paularmstrong/onerepo/blob/main/modules/types/src/index.ts#L89)
