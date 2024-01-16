import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import * as git from '@onerepo/git';
import { getGraph } from '@onerepo/graph';
import * as Sync from '../sync';
import { location } from '../get-codeowners';

const { run, graph } = getCommand(Sync, getGraph(path.join(__dirname, '__fixtures__/repo')));

describe('codeowners sync', () => {
	test.each(Object.entries(location))('writes codeowners for %s to %s', async (provider, location) => {
		vi.spyOn(file, 'write').mockResolvedValue();
		await run(`--provider=${provider}`);

		expect(file.write).toHaveBeenCalledWith(
			graph.root.resolve(location),
			`# fixture-root
*    @tacos

# fixture-burritos
modules/burritos/*    @burritos

# fixture-tacos
modules/tacos/*    @tacos

`,
			{ sign: true },
		);
	});

	test('can add to the git index', async () => {
		vi.spyOn(git, 'updateIndex').mockResolvedValue('');
		vi.spyOn(file, 'write').mockResolvedValue();

		await run('--provider=github --add');

		expect(git.updateIndex).toHaveBeenCalledWith(graph.root.resolve(location.github));
	});
});
