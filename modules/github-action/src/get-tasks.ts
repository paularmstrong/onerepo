import { execSync } from 'node:child_process';
import * as core from '@actions/core';

const cli = core.getInput('cli', { required: true });
const lifecycle = core.getInput('lifecycle', { required: true });
const verbosity = parseInt(core.getInput('verbosity') ?? 2, 10);

const tasks = execSync(`${cli} tasks --lifecycle=${lifecycle} --list -${'v'.repeat(verbosity)}`)
	.toString()
	.trim();

core.setOutput('tasks', tasks);
