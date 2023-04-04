## Installation

```sh
npm install --save-dev @onerepo/plugin-typescript
```

```js {1,5-8}
const { typescript } = require('@onerepo/plugin-typescript');

setup({
	plugins: [
		typescript({
			// The name of the tsconfig files that should be used when checking
			tsconfig: 'tsconfig.check.json',
		}),
	],
}).then(({ run }) => run());
```
