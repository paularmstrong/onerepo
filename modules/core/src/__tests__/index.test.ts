import path from 'node:path';
import createYargs from 'yargs/yargs';
import { setup } from '../setup';

describe('setup', () => {
	test('sets env variables', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		await setup(
			undefined,
			{
				root,
			},
			createYargs(['one', '--help']),
			{},
		);

		expect(process.env.ONE_REPO_ROOT).toMatch(/\/__tests__\/__fixtures__\/repo$/);
		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('main');
		expect(process.env.ONE_REPO_DRY_RUN).toEqual('false');
	});

	test('sets head branch from config', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		await setup(
			undefined,
			{
				root,
				head: 'tacos',
			},
			createYargs(['one', '--help']),
			{},
		);

		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('tacos');
	});

	test('returns shutdown results', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		const yargs = createYargs(['one', 'graph', 'verify']);
		const argv = { tacos: true, $0: 'foo', _: [] };
		vi.spyOn(yargs, 'parse').mockResolvedValue(argv);

		const { run } = await setup(
			undefined,
			{
				root,
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
			{},
		);

		await expect(run()).resolves.toEqual({ tacos: 'yep', burritos: 'yes' });
	});

	// yargs says it's not building a singleton, but it's help documentation actually is
	test.skip.each([['generate']])('does not include %s when set to false', async (key) => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		vi.spyOn(process, 'cwd').mockReturnValue(root);
		const core = { [key]: false };
		const { yargs } = await setup(
			undefined,
			{
				root,
				core,
			},
			createYargs(['one', '--help']),
			{},
		);

		const comp = await yargs.getHelp();
		expect(comp).not.toMatch(key);
	});
});
