import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import { LogStep } from '@onerepo/logger';
import * as Create from '../create';

const { run, graph } = getCommand(Create);

describe('hooks create', () => {
	beforeEach(() => {
		vi.spyOn(file, 'exists').mockResolvedValue(false);
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(file, 'chmod').mockResolvedValue();
		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
	});

	describe('recommended hooks', () => {
		test.each(Create.recommendedHooks)('creates %s', async (hook) => {
			await run('--hooks-path .test-hooks');

			expect(file.write).toHaveBeenCalledWith(
				graph.root.resolve('.test-hooks', hook),
				expectedHook(Create.defaultHooks[hook] ?? '# add your hook command here'),
				{
					step: expect.any(LogStep),
				},
			);
			expect(file.chmod).toHaveBeenCalledWith(graph.root.resolve('.test-hooks', hook), 0o775, {
				step: expect.any(LogStep),
			});
			expect(git.updateIndex).toHaveBeenCalledWith(graph.root.resolve('.test-hooks'));
		});
	});

	test('can disable --add', async () => {
		await run('--hooks-path .test-hooks --no-add');

		expect(git.updateIndex).not.toHaveBeenCalled();
	});

	test('does not overwrite if already exists', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		await expect(run('--hooks-path .test-hooks --hook commit-msg')).resolves.toMatch(
			'Skipping because the hook already exists',
		);

		expect(file.write).not.toHaveBeenCalled();
		expect(file.chmod).not.toHaveBeenCalled();
	});

	test('can overwrite with --overwrite', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		await expect(run('--hooks-path .test-hooks --hook commit-msg --overwrite')).resolves.not.toMatch(
			'Skipping because the hook already exists',
		);

		expect(file.write).toHaveBeenCalled();
		expect(file.chmod).toHaveBeenCalled();
	});

	test('fills in a comment for non-recommended hooks', async () => {
		await run('--hooks-path .test-hooks --hook applypatch-msg');

		expect(file.write).toHaveBeenCalledWith(
			graph.root.resolve('.test-hooks/applypatch-msg'),
			expectedHook('# add your hook command here'),
			{
				step: expect.any(LogStep),
			},
		);
		expect(file.chmod).toHaveBeenCalledWith(graph.root.resolve('.test-hooks/applypatch-msg'), 0o775, {
			step: expect.any(LogStep),
		});
	});
});

function expectedHook(contents: string) {
	return `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/hooks.sh"

${contents}
`;
}
