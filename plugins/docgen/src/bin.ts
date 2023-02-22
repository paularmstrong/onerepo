#!/usr/bin/env node

import yargsParser from 'yargs-parser';

import { generate } from './generate';

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
