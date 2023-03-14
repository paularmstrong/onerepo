import path from 'node:path';
import inquirer from 'inquirer';
import * as Generate from './generate';
import { run as processRun } from '@onerepo/subprocess';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';

jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

jest.mock('@onerepo/subprocess');

const { run: mainRun } = getCommand(Generate);

function run(cmd: string) {
	return mainRun(`${cmd} --templates-dir=${path.join(__dirname, '__fixtures__')}`);
}

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(inquirer, 'prompt').mockImplementation(() => Promise.resolve({}));
		jest.spyOn(file, 'write').mockResolvedValue();
		jest.spyOn(file, 'exists').mockResolvedValue(true);
	});

	test('will prompt for type', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ templateInput: 'app', name: 'burritos' });
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith([
			{
				name: 'templateInput',
				type: 'list',
				message: 'Choose a template…',
				choices: ['app', 'module'],
			},
		]);
	});

	test('can have custom prompts', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ templateInput: 'module', name: 'burritos' });
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith(
			expect.arrayContaining([
				{
					name: 'description',
					type: 'input',
					message: 'How would you describe tacos?',
				},
			])
		);
	});

	test('if type is provided, does not prompt', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type app');
		expect(inquirer.prompt).not.toHaveBeenCalledWith(
			expect.arrayContaining([
				{
					name: 'templateInput',
					type: 'list',
					message: 'Choose a template…',
					choices: ['app', 'module'],
				},
			])
		);
	});

	test('renders files', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type app');

		expect(file.write).toHaveBeenCalledWith('apps/tacos/index.ts', 'tacos\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/tacos/tacos.ts', 'hello\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/tacos/.test', 'this file should be generated\n', expect.any(Object));
		expect(file.write).not.toHaveBeenCalledWith('apps/tacos/.onegen.cjs', expect.any(String), expect.any(Object));
	});

	test('automatically installs dependencies', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		jest.spyOn(file, 'exists').mockResolvedValueOnce(false);

		await run('--type app');
		expect(processRun).nthCalledWith(1, expect.objectContaining({ cmd: 'npm i' }));

		await run('--type app');
		expect(processRun).nthCalledWith(2, expect.objectContaining({ cmd: 'yarn' }));
	});
});
