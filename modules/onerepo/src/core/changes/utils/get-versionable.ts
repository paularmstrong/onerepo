import { glob } from 'node:fs/promises';
import type { ReleaseType as SemverReleaseType } from 'semver';
import { inc, prerelease } from 'semver';
import type { Graph, Workspace } from '@onerepo/graph';
import { run } from '@onerepo/subprocess';
import type { LogStep } from '@onerepo/logger';
import { stepWrapper } from '@onerepo/logger';
import { getCurrentSha } from '@onerepo/git';
import { readChange } from './read-change.ts';

export type ReleaseType = 'major' | 'minor' | 'patch';
export type ChangeEntry = { type: ReleaseType; content: string; ref: string; filepath: string };
export type VersionPlan = {
	type: ReleaseType;
	version: string;
	entries: Array<ChangeEntry>;
	fromRef: string;
	throughRef: string;
	logs: Array<{ ref: string; subject: string }>;
};

type VersionOptions = { prerelease?: boolean; identifier?: string; snapshot?: string; step?: LogStep };

export async function getVersionable(graph: Graph, options: VersionOptions = {}) {
	return stepWrapper({ step: options.step, name: 'Get versionable Workspaces' }, async (step) => {
		const workspaces = graph.workspaces;

		const versionable = new Map<Workspace, VersionPlan>();
		for (const workspace of workspaces) {
			if (workspace.private) {
				continue;
			}
			const fromRef = await getLastVersion(workspace, { step });
			const throughRef = await getCurrentSha({ step });

			const changes = await Array.fromAsync(glob('.changes/*.md', { cwd: workspace.location }));
			versionable.set(
				workspace,
				await getVersionPlan(workspace, changes, fromRef ?? '', throughRef, { ...options, step }),
			);
		}

		return versionable;
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

async function getVersionPlan(
	workspace: Workspace,
	changes: Array<string>,
	fromRef: string,
	throughRef: string,
	options: VersionOptions = {},
) {
	const results = await Promise.all(
		changes.map((filepath) => readChange(workspace.resolve(filepath), { step: options.step })),
	);
	let type: keyof typeof levelToNum = 'patch';
	const entries: Array<ChangeEntry> = [];
	for (const result of results) {
		if (result?.content) {
			type = numToLevel[Math.max(levelToNum[result.type], levelToNum[type]) as keyof typeof numToLevel]!;
			// @ts-expect-error content is guaranteed by the conditional
			entries.push(result);
		}
	}

	const [rawLogs] = await run({
		name: `Get logs for ${workspace.name}`,
		cmd: 'git',
		args: [
			'log',
			'-z',
			'--format=pretty:%H\u0003\u0002%s',
			...(fromRef ? [`${fromRef}..`] : ''),
			'--',
			workspace.location,
		],
		step: options.step,
		runDry: true,
	});

	const logs = rawLogs
		.split('\u0000')
		.map((str) => {
			const [ref = '', subject = ''] = str.split('\u0003\u0002');
			return { ref, subject };
		})
		.filter(({ subject }) => !!subject);

	const version = options.snapshot
		? `0.0.0-${options.identifier}-${options.snapshot}`
		: inc(workspace.version!, getReleaseType(workspace.version!, type, options.prerelease), options.identifier)!;
	return {
		type,
		version,
		entries,
		fromRef,
		throughRef,
		logs,
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
