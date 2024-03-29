import { execSync } from 'node:child_process';
import * as core from '@actions/core';

const pkgManager = core.getInput('packageManager', { required: true });
const overrideBin = core.getInput('overrideBin', { required: false });
const lifecycle = core.getInput('lifecycle', { required: true });
const verbosity = parseInt(core.getInput('verbosity') ?? 2, 10);

const tasks = execSync(
	`${overrideBin ? overrideBin : `${pkgManager} one`} tasks --lifecycle=${lifecycle} --list -${'v'.repeat(verbosity)}`,
	{ env: { ONEREPO_USE_HOOKS: '0', ...process.env } },
)
	.toString()
	.trim();

core.setOutput('tasks', tasks);
