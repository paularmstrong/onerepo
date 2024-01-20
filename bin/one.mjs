#!/usr/bin/env node
import initJiti from 'jiti';

/**
 * Important note: this file is only necessary for the oneRepo source repository
 * because we run all CI through the source files themselves, which are written
 * in TypeScript. Without using this file, we will see errors like:
 *
 *   TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" …
 *
 * This is also the reason that the root package.json overrides the `bin` for
 * the `one` CLI to point to this file.
 */

const jiti = initJiti(import.meta.url, { interopDefault: true });

jiti('onerepo/src/bin/one.ts');
