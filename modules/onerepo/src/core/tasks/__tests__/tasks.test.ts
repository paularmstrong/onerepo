import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import * as subprocess from '@onerepo/subprocess';
import * as Tasks from '../tasks';

const { build, run } = getCommand(Tasks);

describe('builder', () => {
	test('requires --lifecycle', async () => {
		await expect(build('')).rejects.toBeUndefined();
	});

	test('succeeds with --lifecycle', async () => {
		await expect(build('--lifecycle pre-commit')).resolves.toMatchObject({ lifecycle: 'pre-commit' });
		await expect(build('--lifecycle build')).resolves.toMatchObject({ lifecycle: 'build' });
	});

	test('-c is an alias for --lifecycle', async () => {
		await expect(build('-c build')).resolves.toMatchObject({ lifecycle: 'build' });
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
	let out = '';

	beforeEach(() => {
		out = '';
		vi.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	afterEach(() => {
		out = '';
	});

	test('lists tasks for the given lifecycle', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle pre-commit --list', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [
				[expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['lint', '-vv'] })],
				[expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['tsc', '-vv'] })],
			],
			serial: [],
		});
	});

	test('includes meta information on task list', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle pre-merge --list', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: expect.arrayContaining([
				[
					expect.objectContaining({
						cmd: 'echo',
						args: ['"pre-merge"', '"burritos"'],
						opts: { cwd: 'modules/burritos' },
						meta: { good: 'yes', name: 'fixture-burritos', slug: 'fixture-burritos' },
					}),
				],
			]),
		});
	});

	test('returns no tasks if all files were ignored', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/tacos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c pre-commit --list --ignore "modules/tacos/**/*"', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('can ignore files', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/tacos/src/index.ts',
			'modules/burritos/src/index.ts',
		]);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c post-commit --list --ignore "modules/tacos/**/*"', { graph });

		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: [
				[
					expect.objectContaining({
						cmd: 'echo',
						args: ['"post-commit"'],
						opts: { cwd: '.' },
						meta: { name: 'fixture-root', slug: 'fixture-root' },
					}),
				],
			],
		});
	});

	test('includes sequential tasks', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/tacos/src/index.ts',
			'modules/burritos/src/index.ts',
		]);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c pre-merge --list', { graph });

		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: [
				[
					expect.objectContaining({
						cmd: expect.stringMatching(/test-runner$/),
						args: ['lint', '-vv'],
						opts: { cwd: '.' },
						meta: { name: 'fixture-root', slug: 'fixture-root' },
					}),
					expect.objectContaining({
						cmd: expect.stringMatching(/test-runner$/),
						args: ['format', '-vv'],
						opts: { cwd: '.' },
						meta: { name: 'fixture-root', slug: 'fixture-root' },
					}),
				],
				[
					expect.objectContaining({
						cmd: 'echo',
						args: ['"pre-merge"', '"burritos"'],
						opts: { cwd: 'modules/burritos' },
					}),
				],
			],
		});
	});

	test('filters out commands when matchers do not match', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue([
			'modules/tacos/src/index.ts',
			'modules/burritos/src/index.ts',
		]);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c build --list', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('includes tasks that match across workspaces', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c pre-publish --list', { graph });

		expect(JSON.parse(out)).toEqual({
			parallel: [
				[
					{
						args: ['tacos'],
						cmd: 'publish',
						meta: { name: 'fixture-tacos', slug: 'fixture-tacos' },
						name: 'publish tacos (fixture-tacos)',
						opts: { cwd: 'modules/tacos' },
					},
				],
			],
			serial: [],
		});
	});

	test('can use multiple matchers', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/tacos/foo']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'multi-match'));

		await run('-c pre-merge --list', { graph });

		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: [
				[
					{
						args: ['"pre-merge"', '"burritos"'],
						cmd: 'echo',
						meta: { name: 'fixture-burritos', slug: 'fixture-burritos' },
						name: 'echo "pre-merge" "burritos" (fixture-burritos)',
						opts: { cwd: 'modules/burritos' },
					},
				],
			],
		});

		out = '';
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/asdf']);

		await run('-c pre-merge --list', { graph });

		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: [
				[
					{
						args: ['"pre-merge"', '"burritos"'],
						cmd: 'echo',
						meta: { name: 'fixture-burritos', slug: 'fixture-burritos' },
						name: 'echo "pre-merge" "burritos" (fixture-burritos)',
						opts: { cwd: 'modules/burritos' },
					},
				],
			],
		});

		out = '';
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/foobar']);

		await run('-c pre-merge --list', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('runs all Workspaces if the root is affected', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['root.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle pre-deploy --list', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [
				[
					{
						args: ['"deployroot"'],
						cmd: 'echo',
						meta: { name: 'fixture-root', slug: 'fixture-root' },
						name: 'echo "deployroot" (fixture-root)',
						opts: { cwd: '.' },
					},
				],
				[
					{
						args: ['"deployburritos"'],
						cmd: 'echo',
						meta: { name: 'fixture-burritos', slug: 'fixture-burritos' },
						name: 'echo "deployburritos" (fixture-burritos)',
						opts: { cwd: 'modules/burritos' },
					},
				],
				[
					{
						args: ['"deploytacos"'],
						cmd: 'echo',
						meta: { name: 'fixture-tacos', slug: 'fixture-tacos' },
						name: 'echo "deploytacos" (fixture-tacos)',
						opts: { cwd: 'modules/tacos' },
					},
				],
			],
			serial: [],
		});
	});

	test('can shard the tasks', async () => {
		vi.spyOn(git, 'getModifiedFiles').mockResolvedValue(['root.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle pre-deploy --list --shard=1/2', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [
				[
					{
						args: ['"deployroot"'],
						cmd: 'echo',
						meta: { name: 'fixture-root', slug: 'fixture-root' },
						name: 'echo "deployroot" (fixture-root)',
						opts: { cwd: '.' },
					},
				],
				[
					{
						args: ['"deployburritos"'],
						cmd: 'echo',
						meta: { name: 'fixture-burritos', slug: 'fixture-burritos' },
						name: 'echo "deployburritos" (fixture-burritos)',
						opts: { cwd: 'modules/burritos' },
					},
				],
			],
			serial: [],
		});

		out = '';

		await run('--lifecycle pre-deploy --list --shard=2/2', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [
				[
					{
						args: ['"deploytacos"'],
						cmd: 'echo',
						meta: { name: 'fixture-tacos', slug: 'fixture-tacos' },
						name: 'echo "deploytacos" (fixture-tacos)',
						opts: { cwd: 'modules/tacos' },
					},
				],
			],
			serial: [],
		});
	});
});
