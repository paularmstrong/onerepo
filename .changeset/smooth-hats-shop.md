---
'@onerepo/test-cli': minor
---

Failing command handlers due to `logger.error` or `logStep.error` calls will now properly reject the handler with the full log output string.
