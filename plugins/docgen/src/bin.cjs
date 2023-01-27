#!/usr/bin/env node

const { register } = require('esbuild-register/dist/node');
const yargsParser = require('yargs-parser');

register({});

const { generate } = require('./generate');
const {
	format,
	root: rootPath = process.cwd(),
	// 'source-url': sourceUrl,
	runnable,
} = yargsParser(process.argv.slice(2));

generate({
	scriptPath: runnable,
	rootPath,
	format,
	commandDirectory: runnable,
});
