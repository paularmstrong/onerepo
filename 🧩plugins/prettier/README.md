## Installation

```sh
npm install --save-dev @onerepo/plugin-prettier
```

```js {1,5-7}
const { prettier } = require('@onerepo/plugin-prettier');

setup({
	plugins: [
		prettier({
			// ...options
		}),
	],
}).then(({ run }) => run());
```
