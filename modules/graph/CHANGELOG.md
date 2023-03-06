# @onerepo/graph

## 0.1.0

### Minor Changes

- Adds the ability to get a graph-data-structure that is isolated to the set of input sources using `graph.isolatedGraph(sources)`. Useful for debugging and walking the `affected` graph, not just an array like is returned from `.affected()`. [#72](https://github.com/paularmstrong/onerepo/pull/72) ([@paularmstrong](https://github.com/paularmstrong))

  Adds standard isolation inputs to `one graph show` to limit the output to `--all`, `--affected`, or a set of `--workspaces`.

### Patch Changes

- Fix building/exporting as faux-esm. oneRepo still requires you to register a runtime requires interpreter like `esbuild-register` until such a time as yargs and others fully support ESM across all APIs. [#79](https://github.com/paularmstrong/onerepo/pull/79) ([@paularmstrong](https://github.com/paularmstrong))

- Ensure git operations are run in dry mode [#117](https://github.com/paularmstrong/onerepo/pull/117) ([@paularmstrong](https://github.com/paularmstrong))
