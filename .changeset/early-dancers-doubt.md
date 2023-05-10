---
'@onerepo/core': minor
'@onerepo/graph': minor
'onerepo': minor
---

Added ability to have _sequential_ steps within both `parallel` and `serial` tasks by providing arrays of steps.

```js
/** @type import('onerepo').graph.TaskConfig */
export default {
	'example-parallel': {
		parallel: ['echo "run separately"', ['echo "first"', 'echo "second"']],
	},
	'example-serial': {
		serial: [['echo "first"', 'echo "second"'], 'echo "run separately"'],
	},
	'example-serial-with-match': {
		serial: [{ cmd: ['echo "first"', 'echo "second"'], match: './**/*' }, 'echo "run separately"'],
	},
};
```
