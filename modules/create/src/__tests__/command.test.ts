import inquirer from 'inquirer';
import * as file from '@onerepo/file';
import * as subprocess from '@onerepo/subprocess';
import { getCommand } from '@onerepo/test-cli';
import * as command from '../command';

const { run } = getCommand(command);

jest.mock('@onerepo/file');
jest.mock('@onerepo/subprocess');

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(new Response(JSON.stringify(mockSearchResponse)))
			.mockResolvedValueOnce(new Response(JSON.stringify(mockPackageResponse)));
	});

	test('prompts', async () => {
		jest.spyOn(file, 'write').mockResolvedValue();
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ workspaces: 'foo,bar' });
		await run();

		expect(inquirer.prompt).toHaveBeenCalled();
	});
});

const mockSearchResponse = {
	objects: [
		{
			package: {
				name: '@onerepo/plugin-jest',
				version: '1.2.3',
			},
		},
	],
};

const mockPackageResponse = {
	'dist-tags': {
		latest: '4.5.6',
	},
};
