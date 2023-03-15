import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import * as oneRepo from 'onerepo';
import * as Build from '../build';

const { run } = getCommand(Build);

jest.mock('onerepo', () => ({
	__esModule: true,
	...jest.requireActual('onerepo'),
	file: {
		__esModule: true,
		...jest.requireActual('@onerepo/file'),
	},
}));

const graph = oneRepo.graph.getGraph(path.join(__dirname, '__fixtures__', 'build'));

describe('handler', () => {
	beforeEach(async () => {
		jest.spyOn(oneRepo, 'run').mockImplementation(({ cmd, args }) => {
			if (cmd === 'yarn' && args?.includes('bin')) {
				if (args.includes('vite')) {
					return Promise.resolve(['vite', '']);
				}
				if (args.includes('esbuild')) {
					return Promise.resolve(['esbuild', '']);
				}
				if (args.includes('tsc')) {
					return Promise.resolve(['tsc', '']);
				}
			}
			return Promise.resolve(['', '']);
		});
		jest.spyOn(oneRepo, 'batch').mockResolvedValue([]);
		jest.spyOn(oneRepo.file, 'remove').mockResolvedValue();
	});

	test('builds all workspaces', async () => {
		await run('', { graph });

		expect(oneRepo.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'esbuild',
					args: [
						expect.stringMatching(/build\/modules\/burritos\/src\/index\.ts$/),
						expect.stringMatching(/build\/modules\/burritos\/src\/fixtures\/foo\.ts$/),
						'--bundle',
						'--packages=external',
						expect.stringMatching(/build\/modules\/burritos\/dist$/),
						'--platform=node',
						'--format=esm',
					],
				}),
				expect.objectContaining({
					cmd: 'esbuild',
					args: [
						expect.stringMatching(/build\/modules\/churros\/src\/index\.ts$/),
						'--bundle',
						'--packages=external',
						expect.stringMatching(/build\/modules\/churros\/dist$/),
						'--platform=node',
						'--format=esm',
					],
				}),
			])
		);
	});

	test('does not build private workspaces', async () => {
		await run('', { graph });

		expect(oneRepo.batch).not.toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'esbuild',
					args: [
						expect.stringMatching(/build\/apps/),
						'--bundle',
						'--packages=external',
						expect.stringMatching(/build\/apps$/),
						'--platform=node',
						'--format=esm',
					],
				}),
			])
		);
	});

	test('builds all typedefs if tsconfig.json is present', async () => {
		await run('', { graph });

		expect(oneRepo.batch).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					cmd: 'tsc',
					args: ['--emitDeclarationOnly', '--outDir', expect.stringMatching(/build\/modules\/churros\/dist$/)],
					opts: {
						cwd: expect.stringMatching(/build\/modules\/churros/),
					},
				}),
			])
		);
	});

	test('cleans dist directories', async () => {
		await run('', { graph });

		expect(oneRepo.file.remove).toHaveBeenCalledWith(
			expect.stringMatching(/build\/modules\/burritos\/dist$/),
			expect.any(Object)
		);
		expect(oneRepo.file.remove).toHaveBeenCalledWith(
			expect.stringMatching(/build\/modules\/churros\/dist$/),
			expect.any(Object)
		);
	});

	test('copies fixtures', async () => {
		jest.spyOn(oneRepo.file, 'copy').mockResolvedValue();
		await run('', { graph });

		expect(oneRepo.file.copy).toHaveBeenCalledWith(
			expect.stringMatching(/burritos\/src\/fixtures$/),
			expect.stringMatching(/burritos\/dist\/fixtures$/)
		);
	});
});
