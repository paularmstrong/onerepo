import inquirer from 'inquirer';
import * as file from '@onerepo/file';
import { getCommand } from '@onerepo/test-cli';
import * as command from '../command';

const { run } = getCommand(command);

jest.mock('@onerepo/file');

describe('handler', () => {
	test('prompts', async () => {
		jest.spyOn(file, 'write').mockResolvedValue();
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ workspaces: 'foo,bar' });
		await run();

		expect(inquirer.prompt).toHaveBeenCalled();
	});
});
