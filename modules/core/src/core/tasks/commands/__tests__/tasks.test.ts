import path from 'node:path';
import { getGraph } from '@onerepo/graph';
import * as git from '@onerepo/git';
import { getCommand } from '@onerepo/test-cli';
import * as Tasks from '../tasks';

jest.mock('@onerepo/git');

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
	let out = '';

	beforeEach(() => {
		out = '';
		jest.spyOn(process.stdout, 'write').mockImplementation((content) => {
			out += content.toString();
			return true;
		});
	});

	afterEach(() => {
		out = '';
	});

	test('lists tasks for pre- prefix only', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
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

	test('lists tasks for all pre-, normal, and post-', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle commit --list', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [
				[expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['lint', '-vv'] })],
				[expect.objectContaining({ cmd: expect.stringMatching(/test-runner$/), args: ['tsc', '-vv'] })],
			],
			serial: [
				[expect.objectContaining({ cmd: 'echo', args: ['"commit"'] })],
				[
					expect.objectContaining({
						cmd: 'echo',
						args: ['"post-commit"'],
						opts: { cwd: '.' },
					}),
				],
			],
		});
	});

	test('includes meta information on task list', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle pre-merge --list', { graph });
		expect(JSON.parse(out)).toEqual({
			parallel: [],
			serial: [
				[
					expect.objectContaining({
						cmd: 'echo',
						args: ['"pre-merge"', '"burritos"'],
						opts: { cwd: 'modules/burritos' },
						meta: { good: 'yes', name: 'fixture-burritos', slug: 'fixture-burritos' },
					}),
				],
			],
		});
	});

	test('returns no tasks if all files were ignored', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/tacos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c commit --list --ignore "modules/tacos/**/*"', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('can ignore files', async () => {
		jest
			.spyOn(git, 'getModifiedFiles')
			.mockResolvedValue(['modules/tacos/src/index.ts', 'modules/burritos/src/index.ts']);
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

	test('filters out commands when matchers do not match', async () => {
		jest
			.spyOn(git, 'getModifiedFiles')
			.mockResolvedValue(['modules/tacos/src/index.ts', 'modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c build --list', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('includes tasks that match cross-workspaces', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/src/index.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('-c publish --list', { graph });

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
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/tacos/foo']);
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
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/asdf']);

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
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['modules/burritos/foobar']);

		await run('-c pre-merge --list', { graph });

		expect(JSON.parse(out)).toEqual({ parallel: [], serial: [] });
	});

	test('runs all workspaces if the root is affected', async () => {
		jest.spyOn(git, 'getModifiedFiles').mockResolvedValue(['root.ts']);
		const graph = getGraph(path.join(__dirname, '__fixtures__', 'repo'));

		await run('--lifecycle deploy --list', { graph });
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
});
