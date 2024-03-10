import type { Graph, Workspace } from '@onerepo/graph';
import { exists, read, remove, write } from '@onerepo/file';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import type { RootConfig } from '../../../types';
import type { ChangeEntry, ReleaseType, VersionPlan } from './get-versionable';

type Formatting = Required<Required<RootConfig>['changes']>['formatting'];

export async function buildChangelog(
	plan: VersionPlan,
	dependencies: Map<Workspace, VersionPlan>,
	formatting: Formatting = {},
) {
	const footer = formatting.footer ?? '_View git logs for full change list._';
	const { entries: _ignoreEntries, logs: _ignoreLogs, ...replaceable } = plan;
	const sorted: Record<ReleaseType, Array<string>> = { major: [], minor: [], patch: [] };
	for (const entry of plan.entries) {
		sorted[entry.type].push(getEntry(entry, formatting));
	}

	const entries = [
		getEntrySection('major', sorted.major),
		getEntrySection('minor', sorted.minor),
		getEntrySection('patch', sorted.patch),
	]
		.filter(Boolean)
		.join('\n\n');
	const deps = getDependenciesList(dependencies);

	return `## ${plan.version}

${entries ? `${entries}\n\n` : ''}${deps ? `${deps}\n\n` : ''}${replacer(footer, replaceable)}
`;
}

function replacer(str: string, plan: Record<string, string>) {
	let out = str;
	for (const [key, value] of Object.entries(plan)) {
		out = out.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
		out = out.replace(new RegExp(`\\$\\{${key}.short\\}`, 'g'), value.substring(0, 7));
	}

	return out;
}

function getEntry(entry: ChangeEntry, formatting: Formatting) {
	const commit = formatting.commit ?? '(${ref.short})';
	const [firstLine, ...rest] = entry.content.split('\n');
	return `- ${firstLine} ${replacer(commit, { ref: entry.ref })}${
		rest ? `\n${rest.join('\n').replace(/^/gm, '   ')}` : ''
	}`.trim();
}

function getEntrySection(type: ReleaseType, entries: Array<string>) {
	if (entries.length === 0) {
		return null;
	}

	return `### ${typeToHeading[type]}\n\n${entries.join('\n')}`;
}

const typeToHeading: Record<ReleaseType, string> = {
	major: 'Major changes',
	minor: 'Minor changes',
	patch: 'Patch changes',
};

function getDependenciesList(dependencies: Map<Workspace, VersionPlan>) {
	if (!dependencies.size) {
		return null;
	}

	const lines = Array.from(dependencies.keys()).map((dep) => `- ${dep.name}@${dependencies.get(dep)!.version}`);

	return `### Dependencies updated

${lines.join('\n')}`;
}

async function writeChangelog(
	workspace: Workspace,
	plan: VersionPlan,
	dependencies: Map<Workspace, VersionPlan>,
	formatting: Formatting,
	options: { step?: LogStep } = {},
) {
	return stepWrapper({ name: `Write ${workspace.name} changelog`, step: options.step }, async (step) => {
		const newContents = await buildChangelog(plan, dependencies, formatting);

		const filepath = workspace.resolve('CHANGELOG.md');
		if (!(await exists(filepath, { step }))) {
			await write(filepath, `# ${workspace.name} Changelog\n\n`, { step });
		}
		const oldContents = await read(filepath, 'r', { step });

		const updatedContents = oldContents.replace(/^# (.*)\n/, `# $1\n\n${newContents}`);

		await write(filepath, updatedContents, { step });
	});
}

export async function consumeChangelogs(
	workspaces: Array<Workspace>,
	graph: Graph,
	plans: Map<Workspace, VersionPlan>,
	formatting: Formatting,
	options: { step?: LogStep } = {},
) {
	return stepWrapper({ name: `Consume change entries`, step: options.step }, async (step) => {
		for (const ws of workspaces) {
			const plan = plans.get(ws);
			if (!plan) {
				throw new Error(`Missing version plan for ${ws.name}`);
			}
			const deps = graph.dependencies(ws);
			const depPlans = new Map<Workspace, VersionPlan>();
			for (const dep of deps) {
				const depPlan = plans.get(dep);
				if (depPlan) {
					depPlans.set(dep, depPlan);
				}
			}
			await writeChangelog(ws, plan, depPlans, formatting);
			for (const { filepath } of plan.entries) {
				remove(filepath, { step });
			}
		}
	});
}
