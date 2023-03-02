#!/usr/bin/env node

require('esbuild-register/dist/node').register({});

const yargsParser = require('yargs-parser');
const { generate } = require('./generate');

const {
	root: rootPath = process.cwd(),
	// 'source-url': sourceUrl,
	runnable,
} = yargsParser(process.argv.slice(2));

generate({
	scriptPath: runnable,
	rootPath,
	commandDirectory: runnable,
});
