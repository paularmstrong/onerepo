---
layout: '../../layouts/Doc.astro'
title: Why oneRepo
---

# Why oneRepo

Other monorepo tooling either does too much or not enough in order to maintain a healthy monorepo for distributed organizations that need conformance, stability, and discoverability.

Many tools available for JavaScript repos rely on writing individual commands into each workspace’s [`package.json` `"scripts"`](https://docs.npmjs.com/cli/v9/using-npm/scripts). This creates both a brittle setup, copy/paste boilerplate, reduced reusability, and limited documentation & discoverability.

Furthermore, it is difficult to remember how to run scripts in individual workspaces due to lack of documentation on `package.json` scripts – and other tooling does not provide a way to enforce standards or help developers find what they’re looking for – relying instead on manual documentation, or worse, memory.
