---
'@onerepo/builders': minor
'onerepo': minor
'@onerepo/yargs': minor
---

Using `getFilepaths` and `getters.getFilepaths` to return the list of affected filepaths now has a threshold. When the threshold is reached, the relative workspace locations for the affected files will be returned instead. This threshold can be configured via the getter options: `{ affectedThreshold: number }`.
