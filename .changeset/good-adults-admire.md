---
'@onerepo/graph': minor
'onerepo': patch
---

Adds the ability to get a graph-data-structure that is isolated to the set of input sources using `graph.isolatedGraph(sources)`. Useful for debugging and walking the `affected` graph, not just an array like is returned from `.affected()`.

Adds standard isolation inputs to `one graph show` to limit the output to `--all`, `--affected`, or a set of `--workspaces`.
