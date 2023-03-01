---
title: 'API: interfaces/Config'
---

<!--
Do not modify!
Changes to this file will automatically be overwritten from source.

To make changes, modify typedoc comments in the source files.
-->

[onerepo](/docs/core/api/public/) / Config

# Interface: Config

Setup configuration for the oneRepo command-line interface.

## Properties

### core

`Optional` **core**: `CoreOptions`

Core plugin configuration. These plugins will be added automatically unless the value specified is `false`

#### Defined in

[modules/core/src/index.ts:55](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L55)

---

### description

`Optional` **description**: `string`

When you ask for `--help` at the root of the CLI, this description will be shown. It might even show up in documentation, so don't make it too funny…

#### Defined in

[modules/core/src/index.ts:67](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L67)

---

### head

`Optional` **head**: `string`

What's the default branch of your repo? Probably `main`, but it might be something else, so it's helpful to put that here so that we can determine changed files accurately.

#### Defined in

[modules/core/src/index.ts:59](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L59)

---

### ignoreCommands

`Optional` **ignoreCommands**: `RegExp`

When using subcommandDir, include a regular expression here to ignore files. By default, we will try to override _.(test|spec)._ files and maybe some more. This will override the default.

#### Defined in

[modules/core/src/index.ts:63](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L63)

---

### name

`Optional` **name**: `string`

Give your CLI a unique name that's short and easy to remember.
If not provided, will default to `one`. That's great, but will cause conflicts if you try to use multiple monorepos that are both using oneRepo. But then again, what's the point of having multiple monorepos. Isn't that a bit besides the point?

#### Defined in

[modules/core/src/index.ts:72](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L72)

---

### plugins

`Optional` **plugins**: [`Plugin`](/docs/core/api/public/#plugin)[]

Add shared commands. https://onerepo.tools/docs/plugins/

#### Defined in

[modules/core/src/index.ts:76](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L76)

---

### root

`Optional` **root**: `string`

Absolute path location to the root of the repository.

#### Defined in

[modules/core/src/index.ts:80](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L80)

---

### subcommandDir

`Optional` **subcommandDir**: `string` \| `false`

A string to use as filepaths to subcommands. We'll look for commands in all workspaces using this string. If any are found, they'll be available from the CLI.

#### Defined in

[modules/core/src/index.ts:84](https://github.com/paularmstrong/onerepo/blob/main/modules/core/src/index.ts#L84)
