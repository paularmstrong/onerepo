## Installation

```sh
npm install --save-dev @onerepo/plugin-jest
```

```js {1,5-7}
const { jest } = require('@onerepo/plugin-jest');

setup({
	plugins: [
		jest({
			// ...options
		}),
	],
}).then(({ run }) => run());
```
