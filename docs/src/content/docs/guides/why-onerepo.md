---
title: Why oneRepo
sidebar:
  order: 0
---

**oneRepo** is a suite of tools for managing JavaScript and TypeScript monorepos, with the goal of enabling speed and confidence for all changes.

## Why oneRepo

Other monorepo tooling either does too much or not enough in order to maintain a healthy monorepo for distributed organizations that need conformance, stability, and discoverability.

- **Increased productivity**
- **Safe and strict** Other tools rely on manually configuring globs of files that contribute to workspace integrity and decision making for whether or not checks and tasks must run. oneRepo, on the other hand _does not_ use a cache and automatically determines which workspaces, tasks, and checks must run for any given change. We sacrifice a little bit of speed and processing for strict correctness.

## Alternatives

Many tools available for JavaScript repos rely on writing individual commands into each workspace’s [`package.json` `"scripts"` field](https://docs.npmjs.com/cli/v9/using-npm/scripts). This creates both a brittle setup, copy/paste boilerplate, reduced reusability, and limited documentation & discoverability.

Furthermore, it is difficult to remember how to run scripts in individual workspaces due to lack of documentation on `package.json` scripts – and other tooling does not provide a way to enforce standards or help developers find what they’re looking for – relying instead on manual documentation, or worse, memory.

## Tenets

- **Documented** All commands and options must be documented and respond to `--help` requests.
- **Discoverable** Code for commands must be easy to find and trace.
- **Clear output** All log output must be grouped, labelled with purpose, and clearly defined by its state.
