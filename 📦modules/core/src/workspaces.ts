import { existsSync, lstatSync } from 'node:fs';
import type { Graph, Workspace } from '@onerepo/graph';
import type { Yargs } from '@onerepo/yargs';

export function workspaceBuilder(graph: Graph, dirname: string) {
	return (yargs: Yargs) => {
		yargs
			.usage('$0 workspace <name> <command> [options]')
			.example('$0 ws myapp start [options]', 'Using alias `ws` instead of the full command `workspace`')
			.example(
				'$0 myapp start',
				'The `workspace` command can be completely ommitted and the workspace name can be used as a top-level command instead. This make things quick and easy to remember.'
			)
			.positional('name', {
				description: 'Workspace name – may be the fully qualified package name or an available alias.',
				demandCommand: true,
				type: 'string',
			})
			.positional('command', {
				description: 'Workspace-specific command.',
				demandCommand: true,
				type: 'string',
			})
			.epilogue(
				`Add commands to the \`${dirname}\` directory within a workspace to create workspace-specific commands.`
			);

		const workspaceName = process.argv[3];
		try {
			const ws = graph.getByName(workspaceName)!;
			if (existsSync(ws.resolve(dirname))) {
				addWorkspace(yargs, ws, dirname);
				return yargs.demandCommand(1, `Please enter a command to run in ${ws.name}.`);
			}
		} catch (e) {
			// pass
		}

		// Allow omitting the workspace name if the process working directory is already in a workspace
		const workingWorkspace = graph.getByLocation(process.cwd());
		if (workingWorkspace !== graph.root && existsSync(workingWorkspace.resolve(dirname))) {
			yargs
				.usage('$0 workspace <command> [options]')
				.usage('$0 ws <command> [options]')
				.epilogue(
					`You are currently working in the ${workingWorkspace.name} workspace, so workspace-specific commands will be run by default when a suitable name or alias for this workspace is omitted.`
				);
			return addCommandDir(yargs, workingWorkspace, dirname).demandCommand(
				2,
				`Please enter a valid command for the ${workingWorkspace.name} workspace or enter the name of another workspace for more choices.`
			);
		}

		graph.dependencies().forEach((ws: Workspace) => {
			if (ws.isRoot) {
				return;
			}
			const exists = existsSync(ws.resolve(dirname));
			if (exists && lstatSync(ws.resolve(dirname)).isDirectory()) {
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
