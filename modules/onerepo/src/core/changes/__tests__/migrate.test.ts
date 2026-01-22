import path from 'node:path';
import * as file from '@onerepo/file';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import * as migrate from '../migrate.ts';

const graph = await getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = await getCommand(migrate, graph);

describe('migrate changes', () => {
	beforeEach(() => {
		vi.spyOn(Date, 'now').mockReturnValue(1706903142100);
	});

	test('copies changes to appropriate workspaces', async () => {
		vi.spyOn(file, 'write').mockResolvedValue();

		await run('');

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('cheese').resolve('.changes/000-e1edfb4c.md'),
			`---
type: minor
---

Entry the first.
`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('lettuce').resolve('.changes/000-e1edfb4c.md'),
			`---
type: minor
---

Entry the first.
`,
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('lettuce').resolve('.changes/001-d2105a53.md'),
			`---
type: patch
---

Entry the second.
`,
			{ step: expect.any(LogStep) },
		);
		expect(file.write).toHaveBeenCalledWith(
			graph.getByName('tacos').resolve('.changes/001-d2105a53.md'),
			`---
type: patch
---

Entry the second.
`,
			{ step: expect.any(LogStep) },
		);
	});
});
