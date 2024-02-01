import type { Builder, Handler } from '@onerepo/yargs';
import type { Workspace } from '@onerepo/graph';
import parser from 'yargs-parser';
import unparser from 'yargs-unparser';

export const builder: Builder = (yargs) => yargs;

export function getHandler(cmd: string, workspace: Workspace): Handler {
	return async function (argv, { graph, logger }) {
		const { '--': passthrough = [] } = argv;

		const defaults = parser(cmd);
		const {
			_: [command, ...rest],
			...args
		} = defaults;
		const restArgs = unparser({ _: [], ...args }).map(String);

		logger.info([...rest.map(String), ...restArgs, ...passthrough]);

		await graph.packageManager.run({
			name: `Run ${cmd}`,
			cmd: `${command}`,
			args: [...rest.map(String), ...restArgs, ...passthrough],
			opts: {
				cwd: workspace.location,
				stdio: 'inherit',
			},
		});
	};
}
