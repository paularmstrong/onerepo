import { existsSync } from 'node:fs';
import type { Repository, Workspace } from '@onerepo/graph';
import type { Yargs } from './yarg-types';

export function workspaceBuilder(graph: Repository, dirname: string, scriptName: string) {
	return (yargs: Yargs) => {
		yargs
			.usage(`${scriptName} workspace <name> <command> [options]`)
			.usage(`${scriptName} ws <name> <command> [options]`)
			.epilogue(
				`Add commands to the \`${dirname}\` directory within a workspace to create workspace-specific commands.`
			);

		const workspaceName = process.argv[3];
		if (graph.getByName(workspaceName)) {
			const ws = graph.getByName(workspaceName)!;
			addWorkspace(yargs, ws, dirname);
			return yargs.demandCommand(1, `Please enter a command to run in ${ws.name}.`);
		}

		// Allow omitting the workspace name if the process working directory is already in a workspace
		const workingWorkspace = graph.getByLocation(process.cwd());
		if (workingWorkspace && workingWorkspace !== graph.root) {
			yargs
				.usage(`${scriptName} workspace <command> [options]`)
				.usage(`${scriptName} ws <command> [options]`)
				.epilogue(
					`You are currently working in the ${workingWorkspace.name} workspace, so workspace-specific commands will be run by default when a suitable name or alias for this workspace is omitted.`
				);
			return addCommandDir(yargs, workingWorkspace, dirname).demandCommand(
				2,
				`Please enter a valid command for the ${workingWorkspace.name} workspace or enter the name of another workspace for more choices.`
			);
		}

		graph.dependencies().forEach((name: string) => {
			const ws = graph.getByName(name)!;
			if (ws.isRoot) {
				return;
			}
			if (existsSync(ws.resolve(dirname))) {
				addWorkspace(yargs, ws, dirname);
			}
		});
		return yargs.demandCommand(1, 'Please enter a workspace name from the list above.');
	};
}

function addWorkspace(yargs: Yargs, ws: Workspace, dirname: string): Yargs {
	const wsNames = [ws.name, ...ws.aliases];

	return yargs.command(wsNames, `Runs commands in the \`${ws.name}\` workspace`, (yargs: Yargs) => {
		return addCommandDir(yargs, ws, dirname);
	});
}

function addCommandDir(yargs: Yargs, ws: Workspace, dirname: string): Yargs {
	return yargs
		.commandDir(ws.resolve(dirname))
		.demandCommand(1, `Please enter a valid command for the ${ws.name} workspace.`);
}
