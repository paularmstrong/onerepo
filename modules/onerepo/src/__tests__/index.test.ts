import path from 'node:path';
import createYargs from 'yargs/yargs';
import { setup } from '../setup/setup.ts';

describe('setup', () => {
	test('sets env variables', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		await setup({ root, config: { root: true }, yargs: createYargs(['one', '--help']), corePlugins: [] });

		expect(process.env.ONEREPO_ROOT).toMatch(/\/__tests__\/__fixtures__\/repo$/);
		expect(process.env.ONEREPO_HEAD_BRANCH).toEqual('main');
		expect(process.env.ONEREPO_DRY_RUN).toEqual('false');
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

		expect(process.env.ONEREPO_HEAD_BRANCH).toEqual('tacos');
	});

	test('runs shutdown functions', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		const yargs = createYargs(['one', 'graph', 'verify']);
		const argv = { tacos: true, $0: 'foo', _: [] };
		vi.spyOn(yargs, 'parse').mockResolvedValue(argv);

		const shutdown1 = vi.fn(() => Promise.resolve());
		const shutdown2 = vi.fn(() => Promise.resolve());

		const { run } = await setup({
			root,
			config: {
				root: true,
				head: 'tacos',
				plugins: [
					{
						shutdown: shutdown1,
					},
					{
						shutdown: shutdown2,
					},
				],
			},
			yargs,
			corePlugins: [],
		});

		await run();
		expect(shutdown1).toHaveBeenCalledTimes(1);
		expect(shutdown2).toHaveBeenCalledTimes(1);
	});
});
