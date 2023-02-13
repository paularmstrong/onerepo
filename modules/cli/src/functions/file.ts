import path from 'node:path';
import { existsSync } from 'node:fs';
import type { OpenMode } from 'node:fs';
import fs from 'node:fs/promises';
import { stepWrapper } from '../logger';
import type { Step } from '@onerepo/logger';
import { format as prettier, getFileInfo, resolveConfig } from 'prettier';

function isDryRun() {
	return process.env.ONE_REPO_DRY_RUN === 'true';
}

type Options = {
	step?: Step;
};

export async function exists(filename: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Check if \`${filename}\` exists` }, () => {
		return Promise.resolve(existsSync(filename));
	});
}

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

export async function format(filename: string, contents: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Format ${filename}` }, async (step) => {
		try {
			const info = await getFileInfo(filename, {});
			step.debug(`File info for prettier: ${JSON.stringify(info)}`);

			if (info.inferredParser === null || info.ignored) {
				return contents;
			}
		} catch (e) {
			return contents;
		}
		const config = await resolveConfig(filename);
		step.debug(`Resolved prettier config ${JSON.stringify(config)}`);
		return prettier(contents, { ...config, filepath: filename });
	});
}

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

export async function mkdirp(pathname: string, { step }: Options = {}) {
	return stepWrapper({ step, name: `Create path \`${pathname}\`` }, async (step) => {
		if (isDryRun()) {
			step.warn(`DRY RUN: Not creating directory ${pathname}`);
		}
		step.debug(`Creating dir \`${pathname}\``);
		await fs.mkdir(pathname, { recursive: true });
	});
}

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
 * Safely write contents to a file, wrapped in a start and end sentinel.
 * This allows writing to a file without overwriting the current content of the file –
 * other than that which falls between the start and end sentinel.
 */
export async function writeSafe(
	filename: string,
	contents: string,
	{ sentinel = 'onerepo-sentinel', step }: Options & { sentinel?: string } = {}
) {
	return stepWrapper({ step, name: `Write to ${filename}` }, async (step) => {
		let fileContents = '';
		try {
			fileContents = await read(filename, 'r', { step });
		} catch (e) {
			// it's okay
		}

		const ext = path.extname(filename);
		const [startComment, endComment] = ext in commentStyle ? commentStyle[ext] : fallbackCommentStyle;
		const start = `${startComment}start-${sentinel}${endComment}`;
		const end = `${startComment}end-${sentinel}${endComment}`;

		const matches = fileContents.match(new RegExp(`(\n*${start}(?:.*)${end}\n*)`, 'ms'));

		const appendContent = `${start}\n${contents}\n${end}\n`;
		const leftover = matches && matches.length ? fileContents.replace(matches[1], '') : fileContents;
		const output = `${leftover}\n\n${appendContent}\n`;

		return await write(filename, output, { step });
	});
}
