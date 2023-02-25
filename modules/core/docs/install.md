---
title: Install
description: |
  Install your repository’s CLI into your path, making it easy to use from anywhere!
---

# Install

A helper command to enable you to _install_ global access to your oneRepo CLI. This allows you to run your CLI by name from anywhere within your repository without needing to know the path to the original binary.

## Usage

```sh
./bin/my-cli.cjs install
```

## Disabling

Warning: disabling the graph will disable both the `graph`-specifc commands as well as all workspace-specific commands.

```js
setup({
	core: {
	  // Fully removes the install command from the CLI
		install: false,
	},
}).then({ run } => run());
```

## Usage

<!-- start-auto-generated-from-cli-install -->

### `one install`

Install the oneRepo CLI into your environment.

```sh
one install [options]
```

`npx something-something`? `npm run what`? `yarn that-thing`? `../../../bin/one`? Forget all of that; no more will you need to figure out how to run your CLI. Just install it directly into your user bin PATH with this command.

As an added bonus, tab-completions will be added to your .zshrc or .bash_profile (depending on your current shell).

| Option       | Type                       | Description                                                                                                         | Required |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| `--force`    | `boolean`                  | Force installation regardless of pre-existing command.                                                              |          |
| `--location` | `string`                   | Install location for the binary. Default location is chosen as default option for usr/bin dependent on the OS type. |          |
| `--name`     | `string`, default: `"one"` | Name of the command to install                                                                                      | ✅       |

<!-- end-auto-generated-from-cli-install -->
