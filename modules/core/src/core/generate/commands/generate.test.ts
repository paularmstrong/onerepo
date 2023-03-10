import path from 'node:path';
import inquirer from 'inquirer';
import * as Generate from './generate';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';

jest.mock('@onerepo/file', () => ({
	__esModule: true,
	...jest.requireActual('@onerepo/file'),
}));

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

	test('if type and name are provided, does not prompt', async () => {
		await run('--type app --name tacos');
		expect(inquirer.prompt).not.toHaveBeenCalled();
		expect(file.write).toHaveBeenCalledWith('apps/tacos/index.ts', 'tacos\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/tacos/tacos.ts', 'hello\n', expect.any(Object));
	});

	test('will prompt for type and name', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ templateInput: 'app', nameInput: 'burritos' });
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith([
			{
				name: 'templateInput',
				type: 'list',
				message: 'Choose a template…',
				choices: ['app', 'module'],
			},
		]);

		expect(inquirer.prompt).toHaveBeenCalledWith([
			{
				name: 'nameInput',
				type: 'input',
				message: 'What name should your package have?',
				transformer: expect.any(Function),
				filter: expect.any(Function),
			},
		]);

		expect(file.write).toHaveBeenCalledWith('apps/burritos/index.ts', 'burritos\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/burritos/burritos.ts', 'hello\n', expect.any(Object));
	});

	test('can have custom prompts', async () => {
		jest.spyOn(inquirer, 'prompt').mockResolvedValue({ templateInput: 'module', nameInput: 'burritos' });
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith([
			{
				name: 'description',
				type: 'input',
				message: 'How would you describe tacos?',
			},
		]);
	});
});
