import { spawn } from 'node:child_process';
import type { RunSpec } from 'onerepo';

const input = process.env.INPUT_TASK;
if (!input) {
	throw new Error('Missing required input "tasks"');
}
const parsed: RunSpec | Array<RunSpec> = JSON.parse(input);

const tasks = Array.isArray(parsed) ? parsed : [parsed];

async function run() {
	let failures = false;
	for (const task of tasks) {
		await new Promise<number>((resolve) => {
			const proc = spawn(task.cmd, task.args ?? [], { ...(task.opts ?? {}), stdio: 'inherit' });

			proc.on('exit', (code) => {
				if (code && isFinite(code)) {
					failures = true;
					resolve(code);
					return;
				}
				resolve(0);
			});
		});
	}

	if (failures) {
		process.exitCode = 1;
		process.exit(1);
	}
}

run();
