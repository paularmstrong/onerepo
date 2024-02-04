---
type: minor
---

Logging an empty function will now execute and stringify the return value of the function. This will prevent expensive loops used to build up helpful information strings.

```ts
step.log(() => bigArray.map((item) => item.name));
```
