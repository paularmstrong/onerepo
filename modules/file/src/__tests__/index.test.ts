import * as fsSync from 'node:fs';
import * as fs from 'node:fs/promises';
import * as file from '..';

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('file', () => {
	describe('writeSafe', () => {
		test('writes to file if it does not exist', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(false);

			await file.writeSafe('tacos.txt', 'add some contents');

			expect(fs.readFile).not.toHaveBeenCalled();
			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`

# start-onerepo-sentinel
add some contents
# end-onerepo-sentinel

`,
			);
		});

		test('appends to a file contents when no sentinel is found', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue('original contents');

			await file.writeSafe('tacos.txt', 'add some contents');

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`original contents

# start-onerepo-sentinel
add some contents
# end-onerepo-sentinel

`,
			);
		});

		test('replaces previous content', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(`original contents

# start-onerepo-sentinel
add some contents
# end-onerepo-sentinel
`);

			await file.writeSafe('tacos.txt', 'this is new');

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`original contents

# start-onerepo-sentinel
this is new
# end-onerepo-sentinel
`,
			);
		});

		test('escapes/avoids special substitutions', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(`original contents

# start-onerepo-sentinel
add some contents
# end-onerepo-sentinel
`);

			await file.writeSafe('tacos.txt', "this is new $' $` $1 $$ $&");

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`original contents

# start-onerepo-sentinel
this is new $' $\` $1 $$ $&
# end-onerepo-sentinel
`,
			);
		});

		test('can use a custom sentinel', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(`original contents

# start-tacos
add some contents
# end-tacos
`);

			await file.writeSafe('tacos.txt', 'this is new', { sentinel: 'tacos' });

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`original contents

# start-tacos
this is new
# end-tacos
`,
			);
		});
	});
});
