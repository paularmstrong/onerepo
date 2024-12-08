import path from 'node:path';
import * as glob from 'glob';
import * as file from '@onerepo/file';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import * as migrate from '../migrate';

const graph = getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = getCommand(migrate, graph);

vi.mock('glob', async (requireActual) => {
	const actual = await requireActual();
	const mocked = {};
	for (const [key, val] of Object.entries(actual as Record<string, unknown>)) {
		if (typeof val === 'function') {
			// @ts-ignore
			mocked[key] = vi.fn(val);
		} else {
			// @ts-ignore
			mocked[key] = actual[key];
		}
	}
	return mocked;
});

describe('migrate changes', () => {
	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(1706903142100);
	});

	test('copies changes to appropriate workspaces', async () => {
		vi.spyOn(glob, 'glob').mockResolvedValue(['.changeset/asdf.md', '.changeset/qwer.md']);
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValueOnce(`---
cheese: minor
lettuce: minor
---

Entry the first.`).mockResolvedValueOnce(`---
lettuce: patch
tacos: patch
---

Entry the second.`);
		await run('');

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('cheese').resolve('.changes/000-2c3a33b1.md'),
			`---
type: minor
---

Entry the first.`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('lettuce').resolve('.changes/000-2c3a33b1.md'),
			`---
type: minor
---

Entry the first.`,
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('lettuce').resolve('.changes/001-e34f954d.md'),
			`---
type: patch
---

Entry the second.`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('tacos').resolve('.changes/001-e34f954d.md'),
			`---
type: patch
---

Entry the second.`,
			{ step: expect.any(LogStep) },
		);
	});
});
