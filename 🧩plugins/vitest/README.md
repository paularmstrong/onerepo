## Installation

```sh
npm install --save-dev @onerepo/plugin-vitest
```

```js {1,5-7}
const { vitest } = require('@onerepo/plugin-vitest');

setup({
	plugins: [
		vitest({
			// ...options
		}),
	],
}).then(({ run }) => run());
```
