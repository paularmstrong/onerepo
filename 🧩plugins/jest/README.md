Jest is the recomended framework for headless testing with oneRepo. As opposed to Vitest and others, Jest allows a single runner that can use multiple project configurations. Think of each project as a separate workspace in your repo.

The added benefit of Jest is that as you are working, you can run this single command and it will automatically test appropriate files related to your changes across all workspaces. There's no need to determine which workspaces to run – and can all be done with `--watch` mode at the same time.

## Installation

```sh
npm install --save-dev @onerepo/plugin-jest
```

Add the plugin to your oneRepo bin file:

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

Create a root level jest config with the appropriate references to your workspace Jest configs:

```js title="jest.config.js"
/** @type {import('jest').Config} */
export default {
	projects: ['<rootDir>/apps/*/jest.config.js', '<rootDir>/modules/*/jest.config.js'],
};
```
