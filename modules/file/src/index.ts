/**
 * File manipulation functions.
 *
 * This package is also canonically available from the `onerepo` package under the `file` namespace or methods directly from `@onerepo/file`:
 *
 * @example
 * ```ts {1,4}
 * import { file } from 'onerepo';
 *
 * export handler: Handler =  async () => {
 * 	await file.write('my-file', 'contents');
 * };
 * ```
 *
 * @module
 */

import path from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync } from 'node:fs';
import { chmod as fsChmod, cp, lstat as fsLstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import type { OpenMode } from 'node:fs';
import initJiti from 'jiti';
import { stepWrapper } from '@onerepo/logger';
import type { LogStep } from '@onerepo/logger';
import { signFile, signingToken } from './signing';

export { isSigned, verifySignature } from './signing';
export type { SigningStatus } from './signing';

/**
 * Common file manipulation functions.
 */

function isDryRun() {
	return process.env.ONE_REPO_DRY_RUN === 'true';
}

/**
 * Generic options for file functions
 */
export type Options = {
	/**
	 * Avoid creating a new step in output for each function.
	 * Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
};

/**
 * Step-wrapped `fs.existsSync` implementation.
 *
 * @example Check whether the file `/path/to/file.ts` exists.
 * ```ts
 * await file.exists('/path/to/file.ts');
 * ```
 */
export async function exists(filename: string, options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: `Check if \`${normalizefilepath(filename)}\` exists` }, () => {
		return Promise.resolve(existsSync(filename));
	});
}

/**
 * Sign the contents for a given file without writing out. This function is typically useful for manually comparing signed file contents.
 *
 * @example
 * ```ts
 * const filename = graph.root.resolve('README.md');
 * const currentContents = await file.read(filename);
 * const newContents = generateReadme();
 * if (currentContents !== await signContents(filename, contents)) {
 *   logger.error('Contents mismatch');
 * }
 * ```
 */
export async function signContents(filename: string, contents: string, options: Options = {}) {
	const { step } = options;
	const relativeFilename = normalizefilepath(filename);
	return stepWrapper({ step, name: `Get signed contents of ${relativeFilename}` }, async (step) => {
		const ext = path.extname(filename);
		const [startComment, endComment] = ext in commentStyle ? commentStyle[ext] : fallbackCommentStyle;
		const finalContents = signFile(`${startComment}${signingToken}${endComment}\n\n${contents}`);

		return await format(filename, finalContents, { step });
	});
}

export type WriteOptions = {
	/**
	 * Avoid creating a new step in output for each function.
	 * Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
	/**
	 * Optionally sign the contents for future verification.
	 */
	sign?: boolean;
};

/**
 * Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.
 *
 * If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.
 *
 * @example Write to `/path/to/out.md`.
 * ```ts
 * await file.write('/path/to/out.md', '# hello!');
 * ```
 */
export async function write(filename: string, contents: string, options: WriteOptions = {}) {
	const { step, sign = false } = options;
	const relativeFilename = normalizefilepath(filename);
	return stepWrapper({ step, name: `Write to ${relativeFilename}` }, async (step) => {
		step.debug(`###---- start ${relativeFilename} ----###\n${contents}\n###---- end ${relativeFilename} ----###`);

		await mkdirp(path.dirname(filename), { step });

		if (isDryRun()) {
			step.info(`DRY RUN: Not writing to ${relativeFilename}`);
			return;
		}

		let finalContents = contents;
		if (sign) {
			finalContents = await signContents(filename, contents, { step });
		} else {
			finalContents = await format(filename, finalContents, { step });
		}

		try {
			return await writeFile(filename, finalContents);
		} catch (e) {
			step.error(e);
			throw e;
		}
	});
}

/**
 * Copy a file from one location to another.
 *
 * If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.
 *
 * @example Copy `/path/to/in.md` to `/path/to/out.md`.
 * ```ts
 * await file.copy('/path/to/in.md', '/path/to/out.md');
 * ```
 */
export async function copy(input: string, output: string, options: Options = {}) {
	const { step } = options;
	const relativeInputName = normalizefilepath(input);
	const relativeOutputName = normalizefilepath(output);
	return stepWrapper({ step, name: `Copy ${relativeInputName} to ${relativeOutputName}` }, async (step) => {
		await mkdirp(path.dirname(output), { step });

		if (isDryRun()) {
			step.info(`DRY RUN: Not copying from ${relativeInputName} to ${relativeOutputName}`);
			return;
		}

		try {
			return await cp(input, output, { recursive: true });
		} catch (e) {
			step.error(e);
			throw e;
		}
	});
}

/**
 * Step-wrapped `fs.lstat` implementation. See the [node.js fs.Stats documentation](https://nodejs.org/api/fs.html#class-fsstats) for more on how to use the return data.
 *
 * @returns If the `filename` does not exist, `null` will be returned instead of a Stats object.
 *
 * @example Get the stats of `/path/to/file.md`.
 * ```ts
 * const stat = await file.lstat('/path/to/file.md');
 * if (stat.isDirectory()) { /* ... *\/ }
 * ```
 */
export async function lstat(filename: string, options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: `Stat ${normalizefilepath(filename)}` }, async () => {
		try {
			const stat = await fsLstat(filename);
			return stat;
		} catch (e) {
			return null;
		}
	});
}

/**
 * Read the contents of a file.
 *
 * @example Read the contents of the file `/path/to/file.md`.
 * ```ts
 * const contents = await file.read('/path/to/file.md');
 * ```
 */
export async function read(filename: string, flag: OpenMode = 'r', options: Options = {}) {
	const { step } = options;
	const relativeFilename = normalizefilepath(filename);
	return stepWrapper({ step, name: `Read ${relativeFilename}` }, async (step) => {
		try {
			const contents = await readFile(filename, { flag });
			step.debug(`###---- start ${relativeFilename} ----###\n${contents}\n###---- end ${filename} ----###`);

			return contents.toString();
		} catch (e) {
			step.error(e);
			throw e;
		}
	});
}

/**
 * Recursively create a directory.
 *
 * @example Make a directory (recursively) at `/path/to/something`.
 * ```ts
 * await file.mkdirp('/path/to/something');
 * ```
 */
export async function mkdirp(pathname: string, options: Options = {}) {
	const { step } = options;
	const relativePathname = normalizefilepath(pathname);
	return stepWrapper({ step, name: `Create path \`${relativePathname}\`` }, async (step) => {
		if (isDryRun()) {
			step.info(`DRY RUN: Not creating directory ${relativePathname}`);
		}
		step.debug(`Creating dir \`${pathname}\``);
		await mkdir(pathname, { recursive: true });
	});
}

/**
 * Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`
 *
 * @example Remove the path at `/path/to/something`.
 * ```ts
 * await file.remove('/path/to/something');
 * ```
 */
export async function remove(pathname: string, options: Options = {}) {
	const { step } = options;
	const relativePathname = normalizefilepath(pathname);
	return stepWrapper({ step, name: `Removing path \`${relativePathname}\`` }, async (step) => {
		if (isDryRun()) {
			step.info(`DRY RUN: Not removing ${relativePathname}`);
		}
		step.debug(`Deleting \`${pathname}\``);
		await rm(pathname, { recursive: true, force: true });
	});
}

const commentStyle: Record<string, [string, string]> = {
	'.js': ['// ', ''],
	'.md': ['<!-- ', ' -->'],
	'.mdx': ['{/* ', ' */}'],
	'.html': ['<!-- ', ' -->'],
};
const fallbackCommentStyle = ['# ', ''];

function getComments(filename: string) {
	const ext = path.extname(filename);
	return ext in commentStyle ? commentStyle[ext] : fallbackCommentStyle;
}

const defaultSentinel = 'onerepo-sentinel';

function getSentinels(filename: string, sentinel: string) {
	const ext = path.extname(filename);
	const [startComment, endComment] = ext in commentStyle ? commentStyle[ext] : fallbackCommentStyle;
	const start = `${startComment}start-${sentinel}${endComment}`;
	const end = `${startComment}end-${sentinel}${endComment}`;
	return [start, end];
}

export type WriteSafeOptions = {
	/**
	 * Avoid creating a new step in output for each function.
	 * Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
	/**
	 * Unique string to use as a start and end sentinel for the contents
	 */
	sentinel?: string;
	/**
	 * Optionally sign the contents for future verification.
	 */
	sign?: boolean;
};

/**
 * Safely write contents to a file, wrapped in a start and end sentinel. This allows writing to a file without overwriting the current content of the file – other than that which falls between the start and end sentinel.
 *
 * @example Write to `/path/to/out.md` between a section denoted by the sentinel `'some-unique-string'` while leaving the rest of the file intact.
 * ```ts
 * await file.writeSafe('/path/to/out.md', '# hello', { sentinel: 'some-unique-string' });
 * ```
 *
 * @example Write to a section of the file as signed content for verifying later.
 * ```ts
 * await file.writeSafe('/path/to/out.md', '# hello', { signed: true });
 * ```
 */
export async function writeSafe(filename: string, contents: string, options: WriteSafeOptions = {}) {
	const { sentinel = defaultSentinel, step, sign = false } = options;
	return stepWrapper({ step, name: `Write to ${normalizefilepath(filename)}` }, async (step) => {
		const [match, fileContents] = await readSafe(filename, { sentinel, step });

		const [startComment, endComment] = getComments(filename);
		const [start, end] = getSentinels(filename, sentinel);

		let finalContents = contents;
		if (sign) {
			finalContents = signFile(`${startComment}${signingToken}${endComment}\n\n${contents}`);
		}

		const writeContent = `${start}\n${finalContents}\n${end}`;
		const output =
			match !== null
				? fileContents.replace(`${start}\n${match}\n${end}`, () => writeContent)
				: `${fileContents.trimEnd()}\n\n${writeContent}\n`;

		return await write(filename, output, { step });
	});
}

export type ReadSafeOptions = {
	/**
	 * Avoid creating a new step in output for each function.
	 * Pass a Logger Step to pipe all logs and output to that instead.
	 */
	step?: LogStep;
	/**
	 * Unique string to use as a start and end sentinel for the contents
	 */
	sentinel?: string;
};

/**
 * Read a sentinel-wrapped portion of a file that was previously written with {@link writeSafe} and return both the wrapped portion as well as the full contents of the file.
 *
 * @example
 * ```ts
 * const [portion, fullContents] = await file.readSafe('/path/to/file.md', { sentinel: 'tacos' });
 * ```
 */
export async function readSafe(filename: string, options: ReadSafeOptions = {}): Promise<[string | null, string]> {
	const { sentinel = defaultSentinel, step } = options;
	return stepWrapper(
		{ step, name: `Read portion of ${normalizefilepath(filename)} inside sentinel ${sentinel}` },
		async (step) => {
			let fileContents = '';
			if (await exists(filename, { step })) {
				fileContents = await read(filename, 'r', { step });
			}

			const [start, end] = getSentinels(filename, sentinel);

			const matches = fileContents.match(new RegExp(`${escapeRegExp(start)}\n(.*)\n${escapeRegExp(end)}`, 'ms'));
			step.debug(matches);

			return [matches && matches.length ? matches[1] : null, fileContents];
		},
	);
}

function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Formats files using prettier, if available. Works for both Prettier versions 2 and 3.
 */
async function format(filename: string, contents: string, options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: `Format ${normalizefilepath(filename)}` }, async (step) => {
		const jiti = initJiti(process.cwd(), { interopDefault: true });
		let prettier;
		try {
			prettier = jiti('prettier');
			if ('default' in prettier) {
				prettier = prettier.default;
			}
		} catch (e) {
			return contents;
		}
		try {
			const info = await prettier.getFileInfo(filename, {});
			step.debug(`File info for prettier: ${JSON.stringify(info)}`);

			if (info.inferredParser === null || info.ignored) {
				return contents;
			}
		} catch (e) {
			return contents;
		}
		const config = await prettier.resolveConfig(filename);
		step.debug(`Resolved prettier config ${JSON.stringify(config)}`);
		return prettier.format(contents, { ...config, filepath: filename });
	});
}

/**
 * Create a tmp directory in the os tmpdir.
 *
 * @example Make a temp directory with the prefix `tacos-`
 * ```ts
 * const dir = await file.makeTempDir('tacos-');
 * ```
 */
export async function makeTempDir(prefix: string, options: Options = {}) {
	const { step } = options;
	return stepWrapper({ step, name: `Make temp dir ${prefix}` }, async (step) => {
		const tempdir = path.join(tmpdir(), prefix);

		if (isDryRun()) {
			step.info(`DRY RUN: Create temporary directory ${tempdir}`);
			return tempdir;
		}

		await mkdtemp(tempdir);
		return tempdir;
	});
}

/**
 * Change file permissions
 *
 * @example Make the file `/foo` executable.
 * ```ts
 * await file.chmod('/foo', 'a+x');
 * ```
 */
export async function chmod(filename: string, mode: string | number, options: Options = {}) {
	const { step } = options;
	const relativeFilename = normalizefilepath(filename);
	return stepWrapper({ step, name: `chmod ${relativeFilename}` }, async (step) => {
		if (isDryRun()) {
			step.info(`DRY RUN: chmod ${relativeFilename} ${mode}`);
			return;
		}

		return await fsChmod(filename, mode);
	});
}

function normalizefilepath(filepath: string) {
	if (typeof process.env.ONE_REPO_ROOT === 'string') {
		return filepath.startsWith(process.env.ONE_REPO_ROOT)
			? path.relative(process.env.ONE_REPO_ROOT, filepath)
			: filepath;
	}
	return filepath;
}
