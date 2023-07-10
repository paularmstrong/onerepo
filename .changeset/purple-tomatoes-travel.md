---
'@onerepo/core': minor
'@onerepo/logger': minor
'onerepo': minor
'@onerepo/subprocess': minor
---

Overhauled performance logging. All marks are pairs that start with `onerepo_start_` and `onerepo_end_`. By default, these will be converted into [Node.js performance measureme entries](https://nodejs.org/api/perf_hooks.html#class-performancemeasure) for use in your own telemetry implementation.
