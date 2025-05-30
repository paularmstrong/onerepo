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

		test('replaces previous content with whitespace before sentinel', async () => {
			vi.spyOn(fsSync, 'existsSync').mockReturnValue(true);
			vi.spyOn(fs, 'readFile').mockResolvedValue(`const foo = {
	// start-onerepo-sentinel
	old: 'old',
	// end-onerepo-sentinel
};
`);

			await file.writeSafe('tacos.ts', "	new: 'new'");

			expect(fs.writeFile).toHaveBeenCalledWith(
				'tacos.ts',
				`const foo = {
	// start-onerepo-sentinel
	new: 'new',
	// end-onerepo-sentinel
};
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

			expect(portion).toEqual('\nadd some contents\n');
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

			expect(portion).toEqual('\nadd some contents\n');
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

			expect(portion).toEqual('\nadd some contents\n');
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

	describe('readJson', () => {
		describe('as jsonc', () => {
			test.each([
				['//comment\n{"a":"b"}', { a: 'b' }],
				['/*//comment*/{"a":"b"}', { a: 'b' }],
				['{"a":"b"//comment\n}', { a: 'b' }],
				['{"a":"b"/*comment*/}', { a: 'b' }],
				['{"a"/*\n\n\ncomment\r\n*/:"b"}', { a: 'b' }],
				['/*!\n * comment\n */\n{"a":"b"}', { a: 'b' }],
				['{/*comment*/"a":"b"}', { a: 'b' }],
			])('removes comments %#', async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});

			test.each([
				['{"a":"b//c"}', { a: 'b//c' }],
				['{"a":"b/*c*/"}', { a: 'b/*c*/' }],
				['{"/*a":"b"}', { '/*a': 'b' }],
				['{"\\"/*a":"b"}', { '"/*a': 'b' }],
			])("doesn't strip comments inside strings %#", async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});

			test.each([
				['{"\\\\":"https://foobar.com"}', { '\\': 'https://foobar.com' }],
				['{"foo\\"":"https://foobar.com"}', { 'foo"': 'https://foobar.com' }],
			])('consider escaped slashes when checking for escaped string quote %#', async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});

			test.each([
				['{"a":"b"\n}', { a: 'b' }],
				['{"a":"b"\r\n}', { a: 'b' }],
			])('line endings - no comments %#', async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});
			test.each([
				['{"a":"b"//c\n}', { a: 'b' }],
				['{"a":"b"//c\r\n}', { a: 'b' }],
				['{"a":"b"/*c*/\n}', { a: 'b' }],
				['{"a":"b"/*c*/\r\n}', { a: 'b' }],
				['{"a":"b",/*c\nc2*/"x":"y"\n}', { a: 'b', x: 'y' }],
				['{"a":"b",/*c\r\nc2*/"x":"y"\r\n}', { a: 'b', x: 'y' }],
				['{\r\n\t"a":"b"\r\n} //EOF', { a: 'b' }],
			])('line endings with comments %#', async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});

			test('handles weird escaping', async () => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(
					String.raw`{"x":"x \"sed -e \\\"s/^.\\\\{46\\\\}T//\\\" -e \\\"s/#033/\\\\x1b/g\\\"\""}`,
				);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual({ x: 'x "sed -e \\"s/^.\\\\{46\\\\}T//\\" -e \\"s/#033/\\\\x1b/g\\""' });
			});

			test.each([
				['{"x":true,}', { x: true }],
				['{"x":true,}', { x: true }],
				['{"x":true,\n  }', { x: true }],
				['[true, false,]', [true, false]],
				['[true, false,]', [true, false]],
				['{\n  "array": [\n    true,\n    false,\n  ],\n}', { array: [true, false] }],
				['{\n  "array": [\n    true,\n    false /* comment */ ,\n /*comment*/ ],\n}', { array: [true, false] }],
			])('strips trailing commas %#', async (input, expected) => {
				vi.spyOn(fs, 'readFile').mockResolvedValue(input);
				const output = await file.readJson('anything', 'r', { jsonc: true });

				expect(output).toEqual(expected);
			});
		});
	});
});
