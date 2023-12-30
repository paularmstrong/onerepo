#!/usr/bin/env node

// @ts-expect-error jiti types are wrong for CJS usage
const jiti = require('jiti')(__filename);

jiti('./src/index.ts');
