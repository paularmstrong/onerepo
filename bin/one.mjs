#!/usr/bin/env node
import initJiti from 'jiti';

const jiti = initJiti(import.meta.url, { interopDefault: true });

jiti('onerepo/src/bin/one.ts');
