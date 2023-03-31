#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
require('esbuild-register/dist/node').register({});

// @ts-ignore
require('./src/index.ts');
