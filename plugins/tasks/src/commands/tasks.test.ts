import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import { git } from '@onerepo/cli';
import * as Tasks from './tasks';
import { getCommand } from '@onerepo/test-cli';

const { build, run } = getCommand(Tasks);

describe('builder', () => {
	test('requires --lifecycle', async () => {
		await expect(build('')).rejects.toThrow();
	});

	test('succeeds with --lifecycle', async () => {
		await expect(build('--lifecycle tacos')).resolves.toMatchObject({ lifecycle: 'tacos' });
	});

	test('-c is an alias for --lifecycle', async () => {
		await expect(build('-c tacos')).resolves.toMatchObject({ lifecycle: 'tacos' });
	});

	test('includes other options', async () => {
		await expect(build('-c tacos --list --ignore foo --ignore bar --ignore baz')).resolves.toMatchObject({
			lifecycle: 'tacos',
			list: true,
			ignore: ['foo', 'bar', 'baz'],
		});
	});
});

describe('handler', () => {
	test('lists tasks', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out: string = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('--lifecycle pre-commit --list', { graph });
		expect(JSON.parse(out)).toEqual([
			expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['lint'] }),
			expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['tsc'] }),
		]);
	});
});
