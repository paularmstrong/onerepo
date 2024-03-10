import cliui from 'cliui';
import pc from 'picocolors';
import type { WithWorkspaces } from '@onerepo/builders';
import { withWorkspaces } from '@onerepo/builders';
import type { Workspace } from '@onerepo/graph';
import type { Builder, Handler } from '@onerepo/yargs';
import type { VersionPlan } from './utils';
import { buildChangelog, getVersionable } from './utils';

export const command = ['show'];

export const description = 'Preview the next versions and changelogs for Workspaces.';

type Argv = WithWorkspaces & {
	format: 'json' | 'plain';
};

export const builder: Builder<Argv> = (yargs) =>
	withWorkspaces(yargs.usage(`$0 ${command[0]}`)).option('format', {
		type: 'string',
		choices: ['json', 'plain'] as const,
		default: 'plain' as const,
		description: 'Choose how the results will be returned.',
	});

export const handler: Handler<Argv> = async (argv, { getWorkspaces, graph }) => {
	const { format } = argv;

	const workspaces = await getWorkspaces();

	const versionPlans = await getVersionable(graph);

	const deps = graph.dependencies(workspaces, true);

	const toVersion: Array<Workspace> = Array.from(versionPlans.keys()).filter((ws) => deps.includes(ws));

	if (format === 'json') {
		process.stdout.write(
			JSON.stringify(
				toVersion.reduce(
					(memo, ws) => {
						memo[ws.name] = versionPlans.get(ws)!;
						return memo;
					},
					{} as Record<string, VersionPlan>,
				),
			) + '\n',
		);
		return;
	}

	const ui = cliui({ width: Math.min(160, process.stdout.columns) });
	for (const ws of toVersion) {
		const plan = versionPlans.get(ws)!;
		ui.div(
			{ text: pc.cyan(pc.bold(pc.underline(ws.name))), padding: [1, 0, 0, 0] },
			{ text: `${ws.version} ${pc.dim('→')} ${pc.bold(plan.version)}`, padding: [1, 0, 0, 0] },
		);

		const deps = graph.dependencies(ws);
		const depPlans = new Map<Workspace, VersionPlan>();
		for (const dep of deps) {
			const depPlan = versionPlans.get(dep);
			if (depPlan) {
				depPlans.set(dep, depPlan);
			}
		}

		ui.div({ text: await buildChangelog(plan, depPlans), padding: [0, 2, 0, 2] });
	}
	process.stdout.write(ui.toString() + '\n');
};
