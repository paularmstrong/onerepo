## Installation

```sh
npm install --save-dev @onerepo/plugin-eslint
```

```js {1,5-7}
const { eslint } = require('@onerepo/plugin-eslint');

setup({
	plugins: [
		eslint({
			// ...options
		}),
	],
}).then(({ run }) => run());
```
