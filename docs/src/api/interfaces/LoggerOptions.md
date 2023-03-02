---
title: 'API: interfaces/LoggerOptions'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / LoggerOptions

# Interface: LoggerOptions

## Properties

### verbosity

**verbosity**: `number`

Verbosity ranges from 0 to 5

| Value  | What     | Description                                      |
| ------ | -------- | ------------------------------------------------ |
| `<= 0` | Silent   | No output will be read or written.               |
| `>= 1` | Error    |                                                  |
| `>= 2` | Warnings |                                                  |
| `>= 3` | Log      |                                                  |
| `>= 4` | Debug    | `logger.debug()` will be included                |
| `>= 5` | Timing   | Extra performance timing metrics will be written |

#### Defined in

[modules/logger/src/Logger.ts:20](https://github.com/paularmstrong/onerepo/blob/main/modules/logger/src/Logger.ts#L20)
