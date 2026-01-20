import path from 'node:path';
import inquirer from 'inquirer';
import pc from 'picocolors';
import { getCommand } from '@onerepo/test-cli';
import * as file from '@onerepo/file';
import * as Generate from '../generate.ts';

const { run: mainRun, graph } = await getCommand(Generate);

function run(cmd: string) {
	return mainRun(`${cmd} --templates-dir=${path.join(__dirname, '__fixtures__')}`);
}

function templateInput(name: 'app' | 'module' = 'app') {
	return {
		dir: path.join(__dirname, '__fixtures__', name),
		// eslint-disable-next-line
		config: require(path.join(__dirname, '__fixtures__', name, '.onegen.cjs')),
	};
}

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(graph.packageManager, 'install').mockResolvedValue('lockfile');
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			templateInput: templateInput('app'),
		});
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(file, 'exists').mockResolvedValue(true);
	});

	test('will prompt for type', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ templateInput: templateInput('app'), name: 'burritos' });
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith([
			expect.objectContaining({
				name: 'templateInput',
				type: 'list',
				message: 'Choose a template…',
			}),
		]);
	});

	test('can have custom prompts', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			templateInput: templateInput('module'),
			name: 'burritos',
			description: 'yum',
		});
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith(
			expect.arrayContaining([
				{
					name: 'description',
					type: 'input',
					message: 'How would you describe tacos?',
				},
			]),
		);
	});

	test('can have a custom name/description', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({
			templateInput: templateInput('module'),
			name: 'burritos',
			description: 'yum',
		});
		await run('');

		expect(inquirer.prompt).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					choices: expect.arrayContaining([
						expect.objectContaining({ name: `Modules ${pc.dim('A fancy description')}` }),
					]),
				}),
			]),
		);
	});

	test('if type is provided, does not prompt', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type app');
		expect(inquirer.prompt).not.toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'templateInput',
					type: 'list',
					message: 'Choose a template…',
				}),
			]),
		);
	});

	test('renders files', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type app');

		expect(file.write).toHaveBeenCalledWith('apps/tacos/index.ts', 'tacos\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/tacos/tacos.ts', 'hello\n', expect.any(Object));
		expect(file.write).toHaveBeenCalledWith('apps/tacos/.test', 'this file should be generated\n', expect.any(Object));
		expect(file.write).not.toHaveBeenCalledWith('apps/tacos/.onegen.cjs', expect.any(String), expect.any(Object));
	});

	test('does not run pkgMgr install if no package.json file was templated', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type module');

		expect(graph.packageManager.install).not.toHaveBeenCalled();
	});

	test('runs pkgMgr install after creating package.json file', async () => {
		vi.spyOn(inquirer, 'prompt').mockResolvedValue({ name: 'tacos' });
		await run('--type app');

		expect(graph.packageManager.install).toHaveBeenCalled();
	});
});
