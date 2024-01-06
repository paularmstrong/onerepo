import path from 'node:path';
import os from 'node:os';
import { getCommand } from '@onerepo/test-cli';
import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { LogStep } from '@onerepo/logger';
import * as Install from '../install';
import pkg from '../../../../package.json';

vi.mock('@onerepo/subprocess');
vi.mock('@onerepo/file');

const { build, run } = getCommand(Install);

describe('builder', () => {
	test('sets location to homedir/.onerepo', async () => {
		const { homedir } = os.userInfo();
		vi.spyOn(os, 'platform').mockReturnValue('darwin');
		await expect(build('')).resolves.toMatchObject({ location: path.join(homedir, '.onerepo') });
	});

	test('accepts a custom install location', async () => {
		await expect(build('--location /tmp/foobar')).resolves.toMatchObject({ location: '/tmp/foobar' });
	});
});

describe('handler', () => {
	beforeEach(() => {
		vi.spyOn(file, 'copy').mockResolvedValue();
		vi.spyOn(file, 'remove').mockResolvedValue();
		vi.spyOn(file, 'write').mockResolvedValue();
		vi.spyOn(file, 'writeSafe').mockResolvedValue();
		vi.spyOn(subprocess, 'run').mockResolvedValue(['', '']);
	});

	test('exits if current version is newer than requested', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue('{"version":"999.0.0"}');

		await expect(run('--version=0.0.0')).rejects.toMatch(
			`Current version of oneRepo (999.0.0) is greater than the requested version (0.0.0).`,
		);
	});

	test('can continue through if version check fails using --force', async () => {
		vi.spyOn(file, 'exists').mockResolvedValue(true);
		vi.spyOn(file, 'read').mockResolvedValue('{"version":"999.0.0"}');

		await expect(run('--version=0.0.0 --force')).resolves.toBeTruthy();
	});

	test.each([
		['', '/Users/test-user/.onerepo'],
		['--location=/tmp/onerepo', '/tmp/onerepo'],
	])('happy path %s', async (args, location) => {
		vi.spyOn(os, 'userInfo').mockReturnValue(
			// @ts-ignore acceptable in test
			{ homedir: '/Users/test-user', shell: '/bin/bash' },
		);
		await expect(run(args)).resolves.toMatch('source /Users/test-user/.bash_profile');

		expect(file.write).toHaveBeenCalledWith(
			path.join(location, 'package.json'),
			JSON.stringify(
				{
					name: 'onerepo-bin',
					version: pkg.version,
					type: 'module',
					workspaces: [],
				},
				null,
				2,
			),
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledWith(
			path.join(location, 'onerepo.config.js'),
			`
export default {
	root: true,
};
`,
			{ step: expect.any(LogStep) },
		);

		expect(file.remove).toHaveBeenCalledWith(path.join(location, 'bin'), { step: expect.any(LogStep) });
		expect(file.copy).toHaveBeenCalledWith(
			expect.any(String), // import.meta.url…
			path.join(location, 'bin/one.js'),
			{ step: expect.any(LogStep) },
		);

		expect(file.write).toHaveBeenCalledWith(path.join(location, 'bin/one'), expect.any(String), {
			step: expect.any(LogStep),
		});
		expect(file.write).toHaveBeenCalledWith(path.join(location, 'bin/onerepo'), expect.any(String), {
			step: expect.any(LogStep),
		});

		expect(subprocess.run).toHaveBeenCalledWith(
			expect.objectContaining({
				cmd: 'chmod',
				args: ['a+x', path.join(location, 'bin/one'), path.join(location, 'bin/onerepo')],
			}),
		);

		expect(file.writeSafe).toHaveBeenCalledWith(
			'/Users/test-user/.bash_profile',
			expect.stringContaining(`export PATH="$PATH:${location}/bin"`),
			{
				sentinel: 'onerepo-additions',
				step: expect.any(LogStep),
			},
		);
	});
});
