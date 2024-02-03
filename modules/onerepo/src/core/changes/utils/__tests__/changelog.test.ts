import path from 'node:path';
import * as file from '@onerepo/file';
import type { Workspace } from '@onerepo/graph';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import { writeChangelogs } from '../changelog';
import type { VersionPlan } from '../get-versionable';

const graph = getGraph(path.join(__dirname, '../../__tests__/__fixtures__/with-entries'));
const lettuce = graph.getByName('lettuce');
const tacos = graph.getByName('tacos');

describe('writeChangelogs', () => {
	beforeEach(() => {
		vi.spyOn(file, 'write').mockResolvedValue();
	});

	test('writes changelogs', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue('# Changelog\n');

		const plans = new Map<Workspace, VersionPlan>([
			[
				lettuce,
				{
					type: 'minor' as const,
					version: '1.1.0',
					entries: [{ content: 'exports romaine', ref: 'abc', type: 'minor' }],
					logs: [],
					fromRef: 'abc',
					throughRef: '123',
				},
			],
			[
				tacos,
				{
					type: 'patch' as const,
					version: '1.2.0',
					entries: [{ content: 'Adds romaine options\non a new line', ref: 'abc', type: 'patch' }],
					logs: [],
					fromRef: 'abc',
					throughRef: '123',
				},
			],
		]);
		await writeChangelogs([lettuce, tacos], graph, plans, {});

		expect(file.write).toHaveBeenCalledWith(
			lettuce.resolve('CHANGELOG.md'),
			`# Changelog

## 1.1.0

### Minor changes

- exports romaine (abc)

_View git logs for full change list._
`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			tacos.resolve('CHANGELOG.md'),
			`# Changelog

## 1.2.0

### Patch changes

- Adds romaine options (abc)
   on a new line

### Dependencies updated

- lettuce@1.1.0

_View git logs for full change list._
`,
			{ step: expect.any(LogStep) },
		);
	});

	test('writes changelogs without entries', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue('# Changelog\n');

		const plans = new Map<Workspace, VersionPlan>([
			[
				lettuce,
				{
					type: 'minor' as const,
					version: '1.1.0',
					entries: [],
					logs: [{ ref: '123', subject: 'yep' }],
					fromRef: 'abc',
					throughRef: '123',
				},
			],
			[
				tacos,
				{
					type: 'major' as const,
					version: '1.2.0',
					entries: [],
					logs: [{ ref: '123', subject: 'yep' }],
					fromRef: 'abc',
					throughRef: '123',
				},
			],
		]);
		await writeChangelogs([lettuce, tacos], graph, plans, {});

		expect(file.write).toHaveBeenCalledWith(
			lettuce.resolve('CHANGELOG.md'),
			`# Changelog

## 1.1.0

_View git logs for full change list._
`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			tacos.resolve('CHANGELOG.md'),
			`# Changelog

## 1.2.0

### Dependencies updated

- lettuce@1.1.0

_View git logs for full change list._
`,
			{ step: expect.any(LogStep) },
		);
	});

	test('can override formatting', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue('# Changelog\n');

		const plans = new Map<Workspace, VersionPlan>([
			[
				lettuce,
				{
					type: 'minor' as const,
					version: '1.1.0',
					entries: [{ content: 'exports romaine', ref: 'abc123abc123', type: 'minor' }],
					logs: [],
					fromRef: 'abc123abc123abc',
					throughRef: '123efg123efg123',
				},
			],
		]);
		await writeChangelogs([lettuce], graph, plans, {
			commit: 'override ${ref} (${ref.short})',
			footer: '> footer ${fromRef.short} ${throughRef.short}',
		});

		expect(file.write).toHaveBeenCalledWith(
			lettuce.resolve('CHANGELOG.md'),
			`# Changelog

## 1.1.0

### Minor changes

- exports romaine override abc123abc123 (abc123ab)

> footer abc123ab 123efg12
`,
			{ step: expect.any(LogStep) },
		);
	});
});
