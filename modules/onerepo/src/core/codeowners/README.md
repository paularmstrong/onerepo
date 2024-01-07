---
title: Code owners
description: |
  Manage CODEOWNERS for your repository
usage: codeowners
---

# Code owners

Use code owners to define individuals or teams that are responsible for code in your monorepo and integrate with your git hosting provider's CODEOWNERS implementation.

## Getting started

Set your codeowners provider in your root configuration file:

```ts title="./onerepo.config.ts"
export default {
	core: {
		codeowners: {
			provider: 'github',
		},
	},
};
```

Add `codeowners` to any workspace or root configuration:

```ts title="./modules/workspace/onerepo.config.ts
export default {
	codeowners: {
		'*': ['@my-team', '@person'],
		scripts: ['@infra-team'],
	},
};
```

Run the sync command to update any time you make changes to code owners:

```sh
one codeowners sync
```

## Hosting providers

The following providers are currently enabled:

- [GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) (default)
- [Gitlab](https://docs.gitlab.com/ee/user/project/codeowners/#codeowners-file)
- [Gitea](https://docs.gitea.com/usage/code-owners)
- [BitBucket](https://marketplace.atlassian.com/apps/1218598/code-owners-for-bitbucket?tab=overview&hosting=cloud)[^bitbucket]

[^bitbucket]: Requires add-on "[Code Owners for BitBucket](https://marketplace.atlassian.com/apps/1218598/code-owners-for-bitbucket?tab=overview&hosting=cloud)".

## Options

<!-- start-usage-typedoc -->

This content will be auto-generated. Do not edit

<!-- end-usage-typedoc -->

## Usage

<!-- start-auto-generated-from-cli-codeowners -->

This content will be auto-generated. Do not edit

<!-- end-auto-generated-from-cli-codeowners -->
