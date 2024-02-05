import path from 'node:path';
import inquirer from 'inquirer';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import * as add from '../add';

const graph = getGraph(path.join(__dirname, '__fixtures__/with-entries'));
const { run } = getCommand(add, graph);

describe('add changes', () => {
	beforeEach(() => {
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(git, 'updateIndex').mockResolvedValue('yes');
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({});
		vi.spyOn(Date, 'now').mockReturnValue(1706903142100);
	});

	test('adds change files', async () => {
		vi.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ chosen: ['tacos'] })
			.mockResolvedValueOnce({ confirm: false })
			.mockResolvedValueOnce({ confirm: true })
			.mockResolvedValueOnce({ contents: 'This is the content' });
		await run('');

		const entry = graph.getByName('tacos').resolve('.changes/002-d2f3b1c5.md');
		expect(file.write).toHaveBeenCalledWith(
			entry,
			`---
type: minor
---

This is the content`,
			{ step: expect.any(LogStep) },
		);
		expect(git.updateIndex).toHaveBeenCalledWith([entry]);
	});

	test('adds with semver prompt style', async () => {
		vi.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ chosen: ['tacos'] })
			.mockResolvedValueOnce({ type: 'major' })
			.mockResolvedValueOnce({ contents: 'This is the content' });
		await run('--prompts=semver');

		const entry = graph.getByName('tacos').resolve('.changes/002-d2f3b1c5.md');
		expect(file.write).toHaveBeenCalledWith(
			entry,
			`---
type: major
---

This is the content`,
			{ step: expect.any(LogStep) },
		);
		expect(git.updateIndex).toHaveBeenCalledWith([entry]);
	});

	test('can bypass git updateIndex', async () => {
		vi.spyOn(inquirer, 'prompt')
			.mockResolvedValueOnce({ chosen: ['tacos'] })
			.mockResolvedValueOnce({ confirm: false })
			.mockResolvedValueOnce({ confirm: true })
			.mockResolvedValueOnce({ contents: 'This is the content' });
		await run('--no-add');

		expect(git.updateIndex).not.toHaveBeenCalled();
	});
});
