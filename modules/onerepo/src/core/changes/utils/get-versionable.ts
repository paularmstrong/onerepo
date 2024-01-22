import type { ReleaseType as SemverReleaseType } from 'semver';
import { inc, prerelease } from 'semver';
import { glob } from 'glob';
import type { Graph, Workspace } from '@onerepo/graph';
import { run } from '@onerepo/subprocess';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import { readChange } from './read-change';

export type ReleaseType = 'major' | 'minor' | 'patch';
export type VersionPlan = { type: ReleaseType; version: string; changelogs: Array<string> };

type VersionOptions = { prerelease?: boolean; identifier?: string; snapshot?: string; step?: LogStep };

export async function getVersionable(graph: Graph, options: VersionOptions = {}) {
	return stepWrapper({ step: options.step, name: 'Get versionable workspaces' }, async (step) => {
		const workspaces = graph.workspaces;

		const versionable = new Map<Workspace, VersionPlan>();
		const hasChangesets: Array<Workspace> = [];
		const hasLogs: Array<Workspace> = [];
		for (const workspace of workspaces) {
			if (workspace.private) {
				continue;
			}
			const changes = await glob('.changes/*.md', { cwd: workspace.location });
			if (changes.length) {
				versionable.set(workspace, await getVersionPlan(workspace, changes, { ...options, step }));
				hasChangesets.push(workspace);
				continue;
			}

			const lastVersion = await getLastVersion(workspace, { step });
			const [logs] = await run({
				name: `Get logs for ${workspace.name}`,
				cmd: 'git',
				args: ['log', '-z', '--oneline', ...(lastVersion ? [`${lastVersion}..`] : ''), '--', workspace.location],
				step,
				runDry: true,
			});

			if (logs.length) {
				const version = options.snapshot
					? `0.0.0-${options.identifier}-${options.snapshot}`
					: inc(
							workspace.version!,
							getReleaseType(workspace.version!, 'patch', options.prerelease),
							options.identifier,
						)!;
				versionable.set(workspace, {
					type: 'patch',
					version,
					changelogs: [],
				});
				hasLogs.push(workspace);
			}
		}

		return {
			all: versionable,
			hasChangesets,
			hasLogs,
		};
	});
}

function getReleaseType(version: string, type: ReleaseType, pre?: boolean) {
	let releaseType: SemverReleaseType = type;
	if (pre) {
		if (prerelease(version)) {
			releaseType = 'prerelease';
		} else {
			releaseType = `pre${releaseType}`;
		}
	}
	return releaseType;
}

/**
 * Finds the git SHA that modified the version string in the Workspace's package.json by using git's `-S` flag: https://git-scm.com/docs/git-log#Documentation/git-log.txt--Sltstringgt
 */
export function getLastVersion(workspace: Workspace, options: { step?: LogStep } = {}) {
	return stepWrapper({ step: options.step, name: `Get version sha for ${workspace.name}` }, async (step) => {
		const [sha] = await run({
			name: `Get version sha for ${workspace.name}`,
			cmd: 'git',
			args: [
				'log',
				'-S',
				`"version": "${workspace.version}"`,
				'-n',
				'1',
				'--format=format:%H',
				'--',
				workspace.resolve('package.json'),
			],
			step,
			runDry: true,
			skipFailures: true,
		});

		return sha || null;
	});
}

async function getVersionPlan(workspace: Workspace, changes: Array<string>, options: VersionOptions = {}) {
	const results = await Promise.all(
		changes.map((filepath) => readChange(workspace.resolve(filepath), { step: options.step })),
	);
	let type: keyof typeof levelToNum = 'patch';
	const changelogs: Array<string> = [];
	for (const result of results) {
		if (!result) {
			continue;
		}
		type = numToLevel[Math.max(levelToNum[result.type], levelToNum[type]) as keyof typeof numToLevel];
		changelogs.push(result.contents);
	}
	const version = options.snapshot
		? `0.0.0-${options.identifier}-${options.snapshot}`
		: inc(workspace.version!, getReleaseType(workspace.version!, type, options.prerelease), options.identifier)!;
	return {
		type,
		version,
		changelogs,
	};
}

const levelToNum: Record<ReleaseType, number> = {
	major: 3,
	minor: 2,
	patch: 1,
} as const;

const numToLevel: Record<(typeof levelToNum)[ReleaseType], ReleaseType> = {
	3: 'major',
	2: 'minor',
	1: 'patch',
};
