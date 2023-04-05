---
'@onerepo/graph': minor
---

Adds dependency and dependent filtering option with `DependencyType` enum.

Example: grab only production dependent workspaces:

```ts
graph.dependents(myWorkspace, true, DependencyType.PROD);
```
