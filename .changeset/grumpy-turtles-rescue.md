---
'@onerepo/core': minor
'onerepo': minor
---

CLI in-point is now recommended to be ESM-compatible

Either use the `.mjs` extension or set `"type": "module"` in your root `package.json`.

```js title="./bin/one.mjs"
#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setup } from 'onerepo';

setup({
	root: path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
}).then(({ run }) => run());
```

If using TypeScript, continue to use `esbuild-register`, but import `onerepo` modules and plugins before the `register()` call.
