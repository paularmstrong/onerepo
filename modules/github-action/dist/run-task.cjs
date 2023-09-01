"use strict";

// modules/github-action/src/run-task.ts
var import_node_child_process = require("node:child_process");
var input = process.env.INPUT_TASK;
if (!input) {
  throw new Error('Missing required input "tasks"');
}
var parsed = JSON.parse(input);
var tasks = Array.isArray(parsed) ? parsed : [parsed];
async function run() {
  let failures = false;
  for (const task of tasks) {
    await new Promise((resolve) => {
      const proc = (0, import_node_child_process.spawn)(task.cmd, task.args ?? [], { ...task.opts ?? {}, stdio: "inherit" });
      proc.on("exit", (code) => {
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
