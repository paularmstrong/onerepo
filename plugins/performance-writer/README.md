This is a usable example plugin to demonstrate how to build your own telemetry and performance tracing plugin using the oneRepo plugin API and internal performance entries.

Using a [PerformanceObserver](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#class-perf_hooksperformanceobserver), it listens for performance marks and converts them into measurements from `onerepo_start_` to `onerepo_end_` prefixed entries. On CLI shutdown, the measurements will be written to a file for later operation.

No metrics or information are shared anywhere outside of your local environment.

## Installation

```sh
npm install --save-dev @onerepo/plugin-performance-writer
```

<!-- start-install-typedoc -->
<!-- end-install-typedoc -->
