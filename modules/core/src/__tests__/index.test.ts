import path from 'node:path';
import createYargs from 'yargs/yargs';
import { setup } from '..';
import * as perf from '../performance';

jest.mock('../performance', () => ({
	__esModule: true,
	...jest.requireActual('../performance'),
}));

describe('setup', () => {
	test('sets env variables', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		jest.spyOn(process, 'cwd').mockReturnValue(root);
		await setup(
			{
				root,
			},
			createYargs(['one', '--help']),
		);

		expect(process.env.ONE_REPO_ROOT).toMatch(/\/__tests__\/__fixtures__\/repo$/);
		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('main');
		expect(process.env.ONE_REPO_DRY_RUN).toEqual('false');
		expect(process.env.ONE_REPO_VERBOSITY).toEqual('0');
	});

	test('sets head branch from config', async () => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		jest.spyOn(process, 'cwd').mockReturnValue(root);
		await setup(
			{
				root,
				head: 'tacos',
			},
			createYargs(['one', '--help']),
		);

		expect(process.env.ONE_REPO_HEAD_BRANCH).toEqual('tacos');
	});

	test('runs performance measurement', async () => {
		jest.spyOn(perf, 'measure');
		const root = path.join(__dirname, '__fixtures__', 'repo');
		jest.spyOn(process, 'cwd').mockReturnValue(root);
		const yargs = createYargs(['one', 'graph', 'verify']);
		const argv = { tacos: true, $0: 'foo', _: [] };
		jest.spyOn(yargs, 'parse').mockResolvedValue(argv);

		const { run } = await setup(
			{
				root,
				head: 'tacos',
			},
			yargs,
		);
		await run();

		expect(perf.measure).toHaveBeenCalledWith(argv);
	});

	// yargs says it's not building a singleton, but it's help documentation actually is
	test.skip.each([['generate']])('does not include %s when set to false', async (key) => {
		const root = path.join(__dirname, '__fixtures__', 'repo');
		jest.spyOn(process, 'cwd').mockReturnValue(root);
		const core = { [key]: false };
		const { yargs } = await setup(
			{
				root,
				core,
			},
			createYargs(['one', '--help']),
		);

		const comp = await yargs.getHelp();
		expect(comp).not.toMatch(key);
	});
});
