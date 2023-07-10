---
title: Telemetry
layout: '../../layouts/Docs.astro'
---

# Telemetry

First and foremost: oneRepo _does not_ and _will not_ send metrics, stats, or any other telemetry data anywhere.

However, it _does_ use the [Node.js performance hooks](https://nodejs.org/api/perf_hooks.html) to automatically measure timing of log steps and subprocesses. While nothing is done with this information by default, your application can get measurement entries and decide what to do with that information later.

```tsx title="bin/one.mjs" showLineNumbers {8-12}
import { performance } from 'node:perf_hooks';
import { writeFile } from 'node:fs/promises';
import { setup } from 'onerepo';

setup({})
	.then(({ run }) => run())
	.then(() => {
		const measurements = performance.getEntriesByType('measure');
		// write the measurements somewhere for reuse
		await writeFile('/tmp/one/measurements.json', JSON.stringify(measures, null, 2));
		// detach a subprocess for your reporter and the file
		spawn('my-reporter', ['/tmp/one/measurements.json'], { detached, stdio: 'ignore' });
	});
```

```json title="Sample measurements"
[
	{
		"name": "Program",
		"entryType": "measure",
		"startTime": 53.776582956314,
		"duration": 85.6957499980927,
		"detail": {
			"argv": {
				"_": ["build"],
				"workspaces": ["logger"],
				"dry-run": false,
				"verbosity": 2,
				"silent": false,
				"$0": "one"
			},
			"description": "The measure of time from the beginning of parsing program setup and CLI arguments through the end of the handler & any postHandler options."
		}
	},
	{
		"name": "Handler: build",
		"entryType": "measure",
		"startTime": 79.6299171447754,
		"duration": 1188.8661658763885,
		"detail": {
			"argv": {
				"_": ["build"],
				"workspaces": ["logger"],
				"dry-run": false,
				"verbosity": 2,
				"silent": false,
				"$0": "one"
			}
		}
	},
	{
		"name": "Pre-Handler",
		"entryType": "measure",
		"startTime": 79.73641705513,
		"duration": 3.887083053588867,
		"detail": {
			"argv": {
				"_": ["build"],
				"workspaces": ["logger"],
				"dry-run": false,
				"verbosity": 2,
				"silent": false,
				"$0": "one"
			}
		}
	},
	{
		"name": "Get workspaces from inputs",
		"entryType": "measure",
		"startTime": 83.8167080879211,
		"duration": 0.40558385848999023,
		"detail": {
			"argv": {
				"_": ["build"],
				"workspaces": ["logger"],
				"dry-run": false,
				"verbosity": 2,
				"silent": false,
				"$0": "one"
			}
		}
	}
	// ...
]
```
