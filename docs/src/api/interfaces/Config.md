---
title: 'API: interfaces/Config'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/index/) / Config

# Interface: Config

## Properties

### core

`Optional` **core**: `CoreOptions`

Core plugin configuration. These plugins will be added automatically unless the value specified is `false`

#### Defined in

[modules/core/src/index.ts:52](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L52)

---

### description

`Optional` **description**: `string`

When you ask for --help at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…

#### Defined in

[modules/core/src/index.ts:64](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L64)

---

### head

`Optional` **head**: `string`

What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.

#### Defined in

[modules/core/src/index.ts:56](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L56)

---

### ignoreCommands

`Optional` **ignoreCommands**: `RegExp`

When using subcommandDir, include a regular expression here to ignore files. By default, we will try to override _.(test|spec)._ files and maybe some more. This will override the default.

#### Defined in

[modules/core/src/index.ts:60](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L60)

---

### name

`Optional` **name**: `string`

Give your CLI a unique name that's short and easy to remember.
If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?

#### Defined in

[modules/core/src/index.ts:69](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L69)

---

### plugins

`Optional` **plugins**: [`Plugin`](/docs/core/api/index/#plugin)[]

Add shared commands. https://onerepo.tools/docs/plugins/

#### Defined in

[modules/core/src/index.ts:73](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L73)

---

### root

`Optional` **root**: `string`

Absolute path location to the root of the repository.

#### Defined in

[modules/core/src/index.ts:77](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L77)

---

### subcommandDir

`Optional` **subcommandDir**: `string` \| `false`

A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.

#### Defined in

[modules/core/src/index.ts:81](https://github.com/paularmstrong/onerepo/blob/e65dcdb/modules/core/src/index.ts#L81)
