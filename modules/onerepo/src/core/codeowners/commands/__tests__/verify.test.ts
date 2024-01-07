import path from 'node:path';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import { getGraph } from '@onerepo/graph';
import { LogStep } from '@onerepo/logger';
import * as Verify from '../verify';
import { location } from '../../get-codeowners';

const { run, graph } = getCommand(Verify, getGraph(path.join(__dirname, '__fixtures__/repo')));

describe('codeowners verify', () => {
	test.each(Object.entries(location))('verifies %s from %s', async (provider, location) => {
		vi.spyOn(file, 'read').mockResolvedValue(validContents);
		await expect(run(`--provider=${provider}`)).resolves.toBeTruthy();

		expect(file.read).toHaveBeenCalledWith(graph.root.resolve(location), 'r', { step: expect.any(LogStep) });
	});

	test('errors on incorrect signature', async () => {
		vi.spyOn(file, 'read').mockResolvedValue(invalidSignature);

		await expect(run('--provider=github')).rejects.toMatch(
			`Code owners file (${graph.root.resolve(location.github)}) was manually modified`,
		);
	});

	test('errors on invalid contents', async () => {
		vi.spyOn(file, 'read').mockResolvedValue(invalidContents);

		await expect(run('--provider=gitlab')).rejects.toMatch('Code owners file is not up to date');
	});
});

const contents = `

# fixture-root
*    @tacos

# fixture-burritos
modules/burritos/*    @burritos

# fixture-tacos
modules/tacos/*    @tacos

`;
const validContents = `# @generated SignedSource<<70b845c4905244bf1344ac1b40f19b2c>>${contents}`;
const invalidSignature = `# @generated SignedSource<<tacos!>>${contents}`;
const invalidContents = `# @generated SignedSource<<dad00d44a54be017826fd2f6a6782ee8>>

# @onerepo/root
*    @paularmstrong

`;
