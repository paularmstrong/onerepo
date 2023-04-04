---
layout: '../../../layouts/Docs.astro'
title: Contributing to oneRepo
---

# Contributing

## Getting set up

The [oneRepo repository](https://github.com/paularmstrong/onerepo) uses itself! To get set up to contribute, follow these simple steps:

1. Fork the [oneRepo repository](https://github.com/paularmstrong/onerepo/fork).
2. Clone your fork
3. Ensure you are using Node.js v18
4. If you do not yet have Yarn, enable it with [Corepack](https://nodejs.org/docs/latest-v18.x/api/corepack.html)

   ```sh
   corepack enable
   corepack prepare yarn@stable --activate
   ```

5. Install dependencies:

   ```sh
   yarn
   ```

6. Install the oneRepo CLI and follow any prompts:

   ```sh
   ./bin/one.cjs install
   ```

## CLI

oneRepo uses itself to manage itself. It’s very meta and you’ll like it. Read the help information in your terminal, or at the auto-generated [CLI documentation](/docs/contributing/cli/), built with [@onerepo/plugin-docgen](/docs/plugins/docgen/)!

```sh
one --help
```

## Plugins

Start from a plugin scaffold using the generate command:

```sh
one generate -t plugin --name myplugin
```
