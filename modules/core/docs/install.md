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
