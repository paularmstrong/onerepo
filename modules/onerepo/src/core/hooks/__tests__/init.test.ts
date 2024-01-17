import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import { LogStep } from '@onerepo/logger';
import * as Init from '../init';

const { run, graph } = getCommand(Init);

describe('hooks init', () => {
	beforeEach(() => {
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(file, 'chmod').mockResolvedValue();
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});
	test('happy path', async () => {
		await run('--hooks-path .test-hooks');

		expect(file.write).toHaveBeenCalledWith(
			graph.root.resolve('.test-hooks/_/hooks.sh'),
			expect.stringContaining('#!/usr/bin/env sh\n'),
			{ step: expect.any(LogStep) },
		);
		expect(file.chmod).toHaveBeenCalledWith(graph.root.resolve('.test-hooks/_/hooks.sh'), 0o775, {
			step: expect.any(LogStep),
		});
		expect(file.write).toHaveBeenCalledWith(graph.root.resolve('.test-hooks/_/.gitignore'), '*', {
			step: expect.any(LogStep),
		});

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'git',
				args: ['config', 'core.hooksPath', '.test-hooks'],
			}),
		);
	});
});
