import { existsSync, lstatSync } from 'node:fs';
import type { Workspace } from '@onerepo/graph';
import type { Builder, Yargs } from '@onerepo/yargs';
import type { RequireDirectoryOptions } from 'yargs';
import type { Plugin, WorkspaceConfig } from '../../types';
import { getHandler } from './passthrough';

export const workspace: Plugin = function workspaces(config, graph) {
	const commandDirectory = config.commands.directory;

	return {
		yargs(yargs, visitor) {
			return yargs.command(
				['workspace', 'ws'],
				'Run commands within individual Workspaces.',
				(yargs) => {
					yargs
						.usage(`$0 workspace <workspace-name> <commands...> [options...] -- [passthrough...]`)
						.positional('workspace-name', {
							description: 'The name or alias of a Workspace.',
							type: 'string',
						})
						.positional('command', {
							description: 'Command to run.',
							demandCommand: true,
							type: 'string',
						})
						.epilogue(
							`This enables running both custom commands as defined via the \`commands.directory\` configuration option within each Workspace as well as \`commands.passthrough\` aliases.

Arguments for passthrough commands meant for the underlying command must be sent after \` -- \`.`,
						);

					if (commandDirectory && !process.env.ONEREPO_DOCGEN) {
						const inputWorkspaceName = process.argv[3];
						if (inputWorkspaceName && !inputWorkspaceName.startsWith('-')) {
							try {
								const ws = graph.getByName(inputWorkspaceName)!;
								if (existsSync(ws.resolve(commandDirectory))) {
									addWorkspace(yargs, ws, commandDirectory, visitor);
								}
								return yargs.demandCommand(1, `Please enter a command to run in the ${ws.name} Workspace.`);
							} catch {
								//pass
							}
						}

						for (const ws of graph.workspaces) {
							if (ws.isRoot) {
								continue;
							}
							const exists = existsSync(ws.resolve(commandDirectory));
							if (exists && lstatSync(ws.resolve(commandDirectory)).isDirectory()) {
								addWorkspace(yargs, ws, commandDirectory, visitor);
							}
						}
					}

					return yargs.demandCommand(1, 'Please enter a Workspace name from the list available.');
				},
				() => {},
			);
		},
	};
};

function addWorkspace(
	yargs: Yargs,
	ws: Workspace,
	commandDirectory: string,
	visitor: NonNullable<RequireDirectoryOptions['visit']>,
): Yargs {
	const names = ws.scope ? [ws.name.replace(`${ws.scope}/`, ''), ws.name] : [ws.name];
	const wsNames = [...names, ...ws.aliases].filter((value, index, self) => self.indexOf(value) === index);

	return yargs.command(wsNames, `Runs commands in the "${ws.name}" Workspace.`, (yargs: Yargs) => {
		if (commandDirectory) {
			addCommandDir(yargs, ws, commandDirectory);
		}

		if (ws.isRoot) {
			return yargs;
		}

		for (const [cmd, { description, command }] of Object.entries(
			(ws.config as Required<WorkspaceConfig>).commands.passthrough,
		)) {
			const mod = visitor({
				command: cmd,
				description,
				builder: ((yargs) => yargs) as Builder,
				handler: getHandler(command ?? cmd, ws),
			});
			yargs.command(mod.command, mod.description, mod.builder, mod.handler);
		}
		return yargs;
	});
}

function addCommandDir(yargs: Yargs, ws: Workspace, dirname: string): Yargs {
	return yargs
		.commandDir(ws.resolve(dirname))
		.demandCommand(1, `Please enter a valid command for the ${ws.name} Workspace.`);
}
