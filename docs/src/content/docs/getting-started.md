---
title: Getting started
sort: 0
---

# Getting started with oneRepo

First, install oneRepo's `one` command into your path:

```sh
# With Yarn
yarn dlx --package=onerepo one install

# With NPM
npx --package=onerepo one install
```

Next, use the `create` command to initialize into an existing or a new repository.

```sh
one create
```

## Manually integrating oneRepo

Install dependencies using your package manager of choice.

```sh
# With Yarn
yarn add --dev onerepo

# With NPM
npm install --save-dev onerepo
```

Install the CLI into your system. This will create a command, `one`, that can be run from anywhere in your path. It will always pick up a local version of `onerepo`, if it exists, otherwise fall back on the current version.

```sh
npx one install
```

Create a configuration file at the root of your repository. This may be either JavaScript or TypeScript.

```js title="./onerepo.config.js"
export default {
	root: true,
};
```
