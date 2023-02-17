---
layout: '../../layouts/Docs.astro'
title: Documentation
---

# oneRepo documentation

**oneRepo** is a suite of tools for managing JavaScript and TypeScript monorepos, with the goal of enabling speed and confidence over all else.

- Fast
- Strict
- Opinionated
  - It should always be easy to use the recommended best-practices
  - But when you need to deviate, you should be able to – without too much overhead.

## Why oneRepo

Other monorepo tooling either does too much or not enough in order to maintain a healthy monorepo for distributed organizations that need conformance, stability, and discoverability.

Many tools available for JavaScript repos rely on writing individual commands into each workspace’s [`package.json` `"scripts"`](https://docs.npmjs.com/cli/v9/using-npm/scripts). This creates both a brittle setup, copy/paste boilerplate, reduced reusability, and limited documentation & discoverability.

Furthermore, it is difficult to remember how to run scripts in individual workspaces due to lack of documentation on `package.json` scripts – and other tooling does not provide a way to enforce standards or help developers find what they’re looking for – relying instead on manual documentation, or worse, memory.
