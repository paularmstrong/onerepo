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

		test('can sign the contents', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(false);

			await file.writeSafe('tacos.txt', 'add some contents', { sign: true });

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.txt',
				`

# start-onerepo-sentinel
# @generated SignedSource<<520142a648f037d8cb84834de6aef586>>

add some contents
# end-onerepo-sentinel
`,
			);
		});
	});

	describe('readSafe', () => {
		test('returns null and empty string if file does not exist', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(false);

			const [portion, contents] = await file.readSafe('tacos.txt');

			expect(portion).toBeNull();
			expect(contents).toEqual('');
		});

		test('returns null and contents of file if file exists', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(`original contents`);

			const [portion, contents] = await file.readSafe('tacos.txt');

			expect(portion).toBeNull();
			expect(contents).toEqual('original contents');
		});

		test('returns the matched content with the original', async () => {
			const original = `original contents

# start-onerepo-sentinel
add some contents
# end-onerepo-sentinel
`;
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(original);

			const [portion, contents] = await file.readSafe('tacos.txt');

			expect(portion).toEqual('add some contents');
			expect(contents).toEqual(original);
		});

		test('returns the matched content with the original using custom sentinel', async () => {
			const original = `original contents

# start-tacos
add some contents
# end-tacos
`;
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(original);

			const [portion, contents] = await file.readSafe('tacos.txt', { sentinel: 'tacos' });

			expect(portion).toEqual('add some contents');
			expect(contents).toEqual(original);
		});

		test('properly escapes in order to match mdx comments', async () => {
			const original = `original contents

{/* start-onerepo-sentinel */}
add some contents
{/* end-onerepo-sentinel */}
`;
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(original);

			const [portion, contents] = await file.readSafe('tacos.mdx');

			expect(portion).toEqual('add some contents');
			expect(contents).toEqual(original);
		});
	});

	describe('isSigned', () => {
		test('returns true if signed', async () => {
			expect(file.isSigned('# @generated SignedSource<<520142a648f037d8cb84834de6aef586>>\n\nadd some contents')).toBe(
				true,
			);
		});

		test('returns false if not signed', async () => {
			expect(file.isSigned('tacos')).toBe(false);
		});

		test('returns true if signature is incorrect', async () => {
			expect(file.isSigned('# @generated SignedSource<<520142a648f037d8cb84834de6aef586>>\nfoo')).toBe(true);
		});
	});

	describe('verifySignature', async () => {
		test('returns true if signed correctly', async () => {
			expect(
				file.verifySignature(`# @generated SignedSource<<520142a648f037d8cb84834de6aef586>>

add some contents`),
			).toEqual('valid');
		});

		test('returns false if not signed', async () => {
			expect(file.verifySignature('tacos')).toEqual('unsigned');
		});

		test('returns false if signature is incorrect', async () => {
			expect(file.verifySignature('# @generated SignedSource<<520142a648f037d8cb84834de6aef586>>\nfoo')).toEqual(
				'invalid',
			);
		});
	});
});
