import child_process from 'node:child_process';
import os from 'node:os';
import { getCommand } from '@onerepo/test-cli';
import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import * as Tasks from '../install';

vi.mock('@onerepo/subprocess');
vi.mock('@onerepo/file');

const { build, graph, run } = getCommand(Tasks);

describe('builder', () => {
	test('defaults verbosity to show warnings', async () => {
		await expect(build('--name=tacos')).resolves.toMatchObject({ verbosity: 2 });
	});

	test('sets location based on system', async () => {
		vi.spyOn(os, 'platform').mockReturnValue('darwin');
		await expect(build('--name tacos')).resolves.toMatchObject({ location: '/usr/local/bin' });

		vi.spyOn(os, 'platform').mockReturnValue('linux');
		const info = os.userInfo();
		vi.spyOn(os, 'userInfo').mockReturnValue({ ...info, homedir: '/foo/bar' });
		await expect(build('--name tacos')).resolves.toMatchObject({ location: '/foo/bar/bin' });
	});
});

describe('handler', () => {
	test('exits if bin exists in path', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['/usr/local/bin/tacos', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue('asdfkujhasdfkljh');

		await expect(run('--name tacos')).rejects.toMatch(
			'Refusing to install with name `tacos` because it already exists',
		);
		expect(subprocess.run).toHaveBeenCalledWith(expect.objectContaining({ cmd: 'which', args: ['tacos'] }));
	});

	test('escapes spaces in installation path', async () => {
		const location = 'Dev Location';

		vi.spyOn(subprocess, 'run').mockResolvedValue(['/usr/local/bin/tacos', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue('Dev Location');
		vi.spyOn(os, 'platform').mockReturnValue('darwin');

		await expect(run('--name tacos', { builderExtras: { executable: location } })).resolves.toBeTruthy();

		expect(subprocess.sudo).toHaveBeenCalledWith({
			name: 'Create executable',
			cmd: 'echo',
			args: [`"#!/bin/zsh\n\n${location.replace(' ', '\\ ')} \\$@"`, '|', 'sudo', 'tee', '/usr/local/bin/tacos'],
		});
	});

	test('continues if bin exists but is self-referential', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['/usr/local/bin/tacos', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue('onerepo-test-runner');
		vi.spyOn(os, 'platform').mockReturnValue('darwin');
		await expect(run('--name tacos')).resolves.toBeTruthy();
		expect(subprocess.sudo).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'echo',
				args: [`"#!/bin/zsh\n\n${process.argv[1]} \\$@"`, '|', 'sudo', 'tee', '/usr/local/bin/tacos'],
			}),
		);
		expect(subprocess.sudo).toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'chmod', args: ['a+x', '/usr/local/bin/tacos'] }),
		);
		expect(file.writeSafe).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
			sentinel: 'tacos-cmd-completions',
		});
	});

	test('continues if bin exists with --force', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['/usr/local/bin/tacos', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue('asdfasdf');
		vi.spyOn(os, 'platform').mockReturnValue('darwin');

		await expect(run('--name tacos --force')).resolves.toEqual(expect.any(String));
		expect(subprocess.run).not.toHaveBeenCalledWith(expect.objectContaining({ cmd: 'which', args: ['tacos'] }));

		expect(subprocess.sudo).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'echo',
				args: [`"#!/bin/zsh\n\n${process.argv[1]} \\$@"`, '|', 'sudo', 'tee', '/usr/local/bin/tacos'],
			}),
		);
		expect(subprocess.sudo).toHaveBeenCalledWith(
			expect.objectContaining({ cmd: 'chmod', args: ['a+x', '/usr/local/bin/tacos'] }),
		);
		expect(file.writeSafe).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
			sentinel: 'tacos-cmd-completions',
		});
	});

	test('runs husky install husky is found', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue(process.argv[1]);

		vi.spyOn(file, 'exists').mockResolvedValue(true);
		await expect(run('--name tacos')).resolves.toBeTruthy();

		expect(graph.packageManager.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'husky',
				args: ['install'],
			}),
		);
	});

	test('does not run husky install husky is NOT found', async () => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
		vi.spyOn(graph.packageManager, 'run').mockResolvedValue(['', '']);
		vi.spyOn(subprocess, 'sudo').mockResolvedValue(['', '']);
		vi.spyOn(child_process, 'execSync').mockImplementation(() => '');
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(file, 'read').mockResolvedValue(process.argv[1]);

		vi.spyOn(file, 'exists').mockResolvedValue(false);
		await expect(run('--name tacos')).resolves.toBeTruthy();

		expect(graph.packageManager.run).not.toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'husky',
				args: ['install'],
			}),
		);
	});
});
