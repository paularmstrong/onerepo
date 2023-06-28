---
'@onerepo/subprocess': patch
---

Ensures current environment variables are passed through to subprocesses (normally the default) when passing in extra custom environment variables.

```ts
await run({
	// ...
	opts: {
		// The following will be merged with `...process.env`
		env: { MY_ENV_VAR: 'true' },
	},
});
```
