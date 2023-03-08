---
title: Install
description: |
  Install your repository’s CLI into your path, making it easy to use from anywhere!
usage: install
---

# Install

A helper command to enable you to _install_ global access to your oneRepo CLI. This allows you to run your CLI by name from anywhere within your repository without needing to know the path to the original binary.

## Disabling

**Warning:** Disabling the installation command will make it hard for developers working in your repository to run commands. While it is not recommended to disable the ability to install, it is still possible. Please consider adding your own installation process to make the oneRepo CLI always available.

```js
setup({
	core: {
	  // Fully removes the install command from the CLI
		install: false,
	},
}).then({ run } => run());
```
