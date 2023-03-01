import path from 'node:path';
import { existsSync } from 'node:fs';
import type { OpenMode } from 'node:fs';
import fs from 'node:fs/promises';
import { stepWrapper } from '@onerepo/logger';
import type { Step } from '@onerepo/logger';
import prettier from 'prettier';

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
	step?: Step;
};

/**
 * Step-wrapped `fs.existsSync` implementation.
 *
 * ```ts
 * await file.exists('/path/to/file.ts');
 * ```
 */
export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Check if \`${filename}\` exists` }, () => {
		return Promise.resolve(existsSync(filename));
	});
}

/**
 * Write to a file. This will attempt use Prettier to format the contents based on the `filename` given. If Prettier does not understand the file’s extension, no changes will be made.
 *
 * If `--dry-run` or `process.env.ONE_REPO_DRY_RUN` is true, no files will be modified.
 *
 * ```ts
 * await file.write('/path/to/out.md', '# hello!');
 * ```
 */
export async function write(filename: string, contents: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Write to ${filename}` }, async (step) => {
		step.debug(`###- ${filename} start -###\n${contents}\n###- ${filename} end -###`);

		await mkdirp(path.dirname(filename), { step });

		if (isDryRun()) {
			step.warn(`DRY RUN: Not writing to ${filename}`);
			return;
		}

		const formatted = await format(filename, contents, { step });

		try {
			return await fs.writeFile(filename, formatted);
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
 * ```ts
 * const stat = await file.lstat('/path/to/out.md');
 * if (stat.isDirectory()) { /* ... *\/ }
 * ```
 */
export async function lstat(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Stat ${filename}` }, async () => {
		try {
			const stat = await fs.lstat(filename);
			return stat;
		} catch (e) {
			return null;
		}
	});
}

/**
 * Read the contents of a file.
 *
 * ```ts
 * const contents = await file.read('/path/to/file.md');
 * ```
 */
export async function read(filename: string, flag: OpenMode = 'r', { step }: Options = {}) {
	return stepWrapper({ step, name: `Read ${filename}` }, async (step) => {
		try {
			const contents = await fs.readFile(filename, { flag });
			step.debug(`###- ${filename} start -###\n${contents}\n###- ${filename} end -###`);

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
 * ```ts
 * await file.mkdirp('/path/to/something');
 * ```
 */
export async function mkdirp(pathname: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Create path \`${pathname}\`` }, async (step) => {
		if (isDryRun()) {
			step.warn(`DRY RUN: Not creating directory ${pathname}`);
		}
		step.debug(`Creating dir \`${pathname}\``);
		await fs.mkdir(pathname, { recursive: true });
	});
}

/**
 * Remove files and folders at a given path. Equivalent to `rm -rf {pathname}`
 *
 * ```ts
 * await file.remove('/path/to/something');
 * ```
 */
export async function remove(pathname: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Removing path \`${pathname}\`` }, async (step) => {
		if (isDryRun()) {
			step.warn(`DRY RUN: Not removing ${pathname}`);
		}
		step.debug(`Deleting \`${pathname}\``);
		await fs.rm(pathname, { recursive: true, force: true });
	});
}

const commentStyle: Record<string, [string, string]> = {
	'.js': ['// ', ''],
	'.md': ['<!-- ', ' -->'],
	'.html': ['<!-- ', ' -->'],
};
const fallbackCommentStyle = ['# ', ''];

/**
 * Safely write contents to a file, wrapped in a start and end sentinel. This allows writing to a file without overwriting the current content of the file – other than that which falls between the start and end sentinel.
 *
 * ```ts
 * await file.writeSafe('/path/to/out.md', '# hello', { sentinel: 'some-unique-string' });
 * ```
 */
export async function writeSafe(
	filename: string,
	contents: string,
	{ sentinel = 'onerepo-sentinel', step }: Options & { sentinel?: string } = {}
) {
	return stepWrapper({ step, name: `Write to ${filename}` }, async (step) => {
		let fileContents = '';
		if (await exists(filename, { step })) {
			try {
				fileContents = await read(filename, 'r', { step });
			} catch (e) {
				// it's okay
			}
		}

		const ext = path.extname(filename);
		const [startComment, endComment] = ext in commentStyle ? commentStyle[ext] : fallbackCommentStyle;
		const start = `${startComment}start-${sentinel}${endComment}`;
		const end = `${startComment}end-${sentinel}${endComment}`;

		const matches = fileContents.match(new RegExp(`(${start}(?:.*)${end}\n*)`, 'ms'));

		const writeContent = `${start}\n${contents}\n${end}\n`;
		const output =
			matches && matches.length
				? fileContents.replace(matches[1], writeContent)
				: `${fileContents}\n\n${writeContent}\n`;

		return await write(filename, output, { step });
	});
}

async function format(filename: string, contents: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Format ${filename}` }, async (step) => {
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
