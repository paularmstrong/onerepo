## Installation

```sh
npm install --save-dev @onerepo/plugin-dependencies
```

```js
const { changesets } = require('@onerepo/plugin-dependencies');

(async () => {
	const { run } = await setup({
		plugins: [dependencies()],
	});

	await run();
})();
```
