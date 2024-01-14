import path from 'node:path';
import createYargs from 'yargs/yargs';
import { setup } from '../setup/setup';

describe('setup', () => {
	test('sets env variables', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		await setup({ root, config: { root: true }, yargs: createYargs(['one', '--help']), corePlugins: [] });

		expect(process.env.ONE_REPO_ROOT).toMatch(/\/__tests__\/__fixtures__\/repo$/);
		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('main');
		expect(process.env.ONE_REPO_DRY_RUN).toEqual('false');
	});

	test('sets head branch from config', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		await setup({
			root,
			config: { root: true, head: 'tacos' },
			yargs: createYargs(['one', '--help']),
			corePlugins: [],
		});

		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('tacos');
	});

	test('returns shutdown results', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		const yargs = createYargs(['one', 'graph', 'verify']);
		const argv = { tacos: true, $0: 'foo', _: [] };
		vi.spyOn(yargs, 'parse').mockResolvedValue(argv);

		const { run } = await setup({
			root,
			config: {
				root: true,
				head: 'tacos',
				plugins: [
					{
						// @ts-ignore
						shutdown() {
							return { tacos: 'yep' };
						},
					},
					{
						// @ts-ignore
						shutdown: function () {
							return Promise.resolve({ burritos: 'yes' });
						},
					},
				],
			},
			yargs,
			corePlugins: [],
		});

		await expect(run()).resolves.toEqual({ tacos: 'yep', burritos: 'yes' });
	});
});
