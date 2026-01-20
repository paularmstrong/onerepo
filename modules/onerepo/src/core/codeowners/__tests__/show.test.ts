import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import { getGraph } from '@onerepo/graph';
import * as Show from '../show.ts';

const { run } = await getCommand(Show, await getGraph(path.join(__dirname, '__fixtures__/repo')));

describe('codeowners show', () => {
	test('shows the codeowners for the given files', async () => {
		const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		await run('-f foobar -f modules/burritos/foobar --provider=github');

		expect(out).toHaveBeenCalledWith(expect.stringContaining('@tacos'));
		expect(out).toHaveBeenCalledWith(expect.stringContaining('@burritos'));
	});

	test('can output as just a list', async () => {
		const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		await run('--list -f foobar -f modules/burritos/foobar --provider=github');

		expect(out).toHaveBeenCalledWith(expect.stringContaining(`  • @tacos\n  • @burritos`));
	});

	test('can output as json', async () => {
		const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		await run('--format=json -f foobar -f modules/burritos/foobar --provider=github');

		expect(out).toHaveBeenCalledWith(
			expect.stringContaining(
				JSON.stringify({ foobar: ['@tacos'], 'modules/burritos/foobar': ['@tacos', '@burritos'] }),
			),
		);
	});

	test('can output as json as just a list', async () => {
		const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		await run('--format=json --list -f foobar -f modules/burritos/foobar --provider=github');

		expect(out).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(['@tacos', '@burritos'])));
	});
});
