import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import * as Tasks from './tasks';
import { getCommand } from '@onerepo/test-cli';

const { build, run } = getCommand(Tasks);

describe('builder', () => {
	test('requires --lifecycle', async () => {
		await expect(build('')).rejects.toThrow();
	});

	test('succeeds with --lifecycle', async () => {
		await expect(build('--lifecycle commit')).resolves.toMatchObject({ lifecycle: 'commit' });
		await expect(build('--lifecycle pre-build')).resolves.toMatchObject({ lifecycle: 'pre-build' });
	});

	test('-c is an alias for --lifecycle', async () => {
		await expect(build('-c pre-build')).resolves.toMatchObject({ lifecycle: 'pre-build' });
	});

	test('includes other options', async () => {
		await expect(build('-c build --list --ignore foo --ignore bar --ignore baz')).resolves.toMatchObject({
			lifecycle: 'build',
			list: true,
			ignore: ['foo', 'bar', 'baz'],
		});
	});
});

describe('handler', () => {
	test('lists tasks for pre- prefix only', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
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

	test('lists tasks for all pre-, normal, and post-', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('--lifecycle commit --list', { graph });
		expect(JSON.parse(out)).toEqual([
			expect.objectContaining({
				cmd: expect.stringMatching(/test-runner$/),
				args: ['lint'],
				opts: { cwd: '.' },
			}),
			expect.objectContaining({
				cmd: expect.stringMatching(/test-runner$/),
				args: ['tsc'],
				opts: { cwd: '.' },
			}),
			expect.objectContaining({ cmd: 'echo', args: ['"commit"'] }),
			expect.objectContaining({
				cmd: 'echo',
				args: ['"post-commit"'],
				opts: { cwd: '.' },
			}),
			expect.objectContaining({
				cmd: 'echo',
				args: ['"post-commit"', '"tacos"'],
				opts: { cwd: 'modules/tacos' },
			}),
		]);
	});

	test('includes meta information on task list', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('--lifecycle pre-merge --list', { graph });
		expect(JSON.parse(out)).toEqual([
			expect.objectContaining({
				cmd: 'echo',
				args: ['"pre-merge"', '"burritos"'],
				opts: { cwd: 'modules/burritos' },
				meta: { good: 'yes', name: 'fixture-burritos', slug: 'fixture-burritos' },
			}),
		]);
	});

	test('returns no tasks if all files were ignored', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['modules/tacos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('-c commit --list --ignore "modules/tacos/**/*"', { graph });

		expect(out).toEqual('[]');
	});

	test('ignores files', async () => {
		vitest
			.spyOn(git, 'getModifiedFiles')
			.mockResolvedValue({ all: ['modules/tacos/src/index.ts', 'modules/burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('-c post-commit --list --ignore "modules/tacos/**/*"', { graph });

		expect(JSON.parse(out)).toEqual([
			expect.objectContaining({
				cmd: 'echo',
				args: ['"post-commit"'],
				opts: { cwd: '.' },
				meta: { name: 'fixture-root', slug: 'fixture-root' },
			}),
		]);
	});

	test('filters out commands when matchers do not match', async () => {
		vitest
			.spyOn(git, 'getModifiedFiles')
			.mockResolvedValue({ all: ['modules/tacos/src/index.ts', 'modules/burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('-c build --list', { graph });

		expect(out).toEqual('[]');
	});

	test('includes tasks that match cross-workspaces', async () => {
		vitest.spyOn(git, 'getModifiedFiles').mockResolvedValue({ all: ['modules/burritos/src/index.ts'] });
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		let out = '';
		vitest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});

		await run('-c publish --list', { graph });

		expect(JSON.parse(out)).toEqual([
			expect.objectContaining({
				cmd: 'publish',
				args: ['tacos'],
			}),
		]);
	});
});
