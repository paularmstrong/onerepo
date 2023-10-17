---
'@onerepo/test-cli': minor
---

`build()` and `run()` now allow overriding the executable (`process.argv[1]`) as well as some hard-coded `ONE_REPO_` environment variables through the second argument to each function.

```ts
const { build, run } = getCommand(Command);

test('in build', async () => {
  await expect(build('foo', { argv: '/foo/bar/bin', env: { … } })).toEqual({ … });
});

test('in run', async () => {
  await run('foo', { graph, argv: '/foo/bar/bin', env: { … } });
});
```
