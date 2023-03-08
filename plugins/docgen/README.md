## Installation

```sh
npm install --save-dev @onerepo/plugin-docgen
```

```js {1,5-7}
const { docgen } = require('@onerepo/plugin-docgen');

setup({
	plugins: [
		docgen({
			// ...options
		}),
	],
}).then(({ run }) => run());
```
