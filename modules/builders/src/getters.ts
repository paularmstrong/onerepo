import path from 'node:path';
import { minimatch } from 'minimatch';
import { stepWrapper } from '@onerepo/logger';
import { getModifiedFiles } from '@onerepo/git';
import type { Graph, Workspace } from '@onerepo/graph';
import type { LogStep } from '@onerepo/logger';
import type { WithAllInputs } from './with-all-inputs';

export type Through = {
	/**
	 * Git ref to calculate changes _exclusively_ _since_.
	 */
	from?: string;
	staged?: false;
	/**
	 * Git ref to calculate changes _inclusively_ _through_.
	 */
	through?: string;
};

export type Staged = {
	from?: never;
	/**
	 * Limit to only changes that are currently staged. This cannot be used with `from` and `through`.
	 */
	staged: true;
	through?: never;
};

/**
 * @group Getter
 */
export type GetterOptions = (Through | Staged) & {
	/**
	 * List of files to not take into account when getting the list of files, workspaces, and affected.
	 */
	ignore?: Array<string>;
	/**
	 * Optional logger step to avoid creating a new
	 */
	step?: LogStep;
};

/**
 * @group Getter
 */
export type Argv = WithAllInputs;

/**
 * Get a list of the affected Workspaces.
 *
 * Typically, this should be used from the helpers provided by the command {@link !Handler | `Handler`}, in which case the first argument has been scoped for you already.
 *
 * If the root Workspace is included in the list, all Workspaces will be presumed affected and returned.
 *
 * ```ts
 * export const handler: Handler = (argv, { getAffected, logger }) => {
 * 	const workspaces = await getAffected();
 * 	for (const ws of workspaces) {
 * 		logger.log(ws.name);
 * 	}
 * };
 * ```
 *
 * @group Getter
 */
export function getAffected(graph: Graph, { from, ignore, staged, step, through }: GetterOptions = {}) {
	return stepWrapper({ step, name: 'Get affected workspaces' }, async (step) => {
		const modifiedOpts = staged ? { staged } : { from, through };
		const all = await getModifiedFiles(modifiedOpts, { step });
		const files =
			ignore && ignore.length ? all.filter((file) => !ignore.some((ignore) => minimatch(file, ignore))) : all;
		step.debug(() => `Modified files not ignored:\n${JSON.stringify(ignore)}\n • ${files.join('\n • ')}`);
		const workspaces = new Set<string>();
		for (const filepath of files) {
			const ws = graph.getByLocation(graph.root.resolve(filepath));
			step.debug(`Found changes within \`${ws.name}\``);
			workspaces.add(ws.name);
		}

		if (workspaces.size === 0) {
			return [];
		}

		/**
		 * Return all Workspaces if the root is included
		 */
		if (workspaces.has(graph.root.name)) {
			step.log('Root Workspace included in affected list. Assuming all Workspaces.');
			return graph.workspaces;
		}

		return await graph.affected(Array.from(workspaces));
	});
}

/**
 * Get a list of Workspaces based on the input arguments made available with the builders {@link !builders.withAffected | `builders.withAffected`}, {@link !builders.withAllInputs | `builders.withAllInputs`}, {@link !builders.withFiles | `builders.withFiles`}, and {@link !builders.withWorkspaces | `builders.withWorkspaces`}.
 *
 * Typically, this should be used from the helpers provided by the command {@link !Handler | `Handler`}, in which case the first argument has been scoped for you already.
 *
 * If the root Workspace is included in the list, all Workspaces will be presumed affected and returned.
 *
 * ```ts
 * export const handler: Handler = (argv, { getWorkspaces, logger }) => {
 * 	const workspaces = await getWorkspaces();
 * 	for (const ws of workspaces) {
 * 		logger.log(ws.name);
 * 	}
 * };
 * ```
 *
 * @group Getter
 */
export async function getWorkspaces(
	graph: Graph,
	argv: Argv,
	{ step, from, staged, through, ...opts }: GetterOptions = {},
): Promise<Array<Workspace>> {
	return stepWrapper({ step, name: 'Get Workspaces from inputs' }, async (step) => {
		let workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			workspaces = graph.workspaces;
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(() => `\`files\` requested: \n • ${argv.files!.join('\n • ')}`);
			workspaces = graph.getAllByLocation(argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(() => `\`workspaces\` requested: \n • ${argv.workspaces!.join('\n • ')}`);
			workspaces = graph.getAllByName(argv.workspaces);
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				step.log(`\`affected\` requested`);
				let affectedOptions: Parameters<typeof getAffected>[1];
				if (argv.staged ?? staged) {
					affectedOptions = { ...opts, staged: true, step };
				} else {
					affectedOptions = { ...opts, from: argv['from-ref'] ?? from, through: argv['through-ref'] ?? through, step };
				}
				workspaces = await getAffected(graph, affectedOptions);
			} else {
				const names = workspaces.map((ws) => ws.name);
				step.log(() => `\`affected\` requested from • ${names.join('\n • ')}`);
				workspaces = await graph.affected(names);
			}
		}

		/**
		 * Return all Workspaces if the root is included
		 */
		if (workspaces.includes(graph.root)) {
			step.log('Root Workspace included in requested list. Assuming all Workspaces.');
			return graph.workspaces;
		}

		return workspaces;
	});
}

export type FileGetterOptions = GetterOptions & {
	/**
	 * Threshold of number of files until we fall-back and swap to Workspace locations. This exists as a safeguard from attempting to pass too many files through to subprocesses and hitting the limit on input argv, resulting in unexpected and unexplainable errors.
	 *
	 * @defaultValue 100
	 */
	affectedThreshold?: number;
};

/**
 * Get a list of filepaths based on the input arguments made available with the builders {@link !builders.withAffected | `builders.withAffected`}, {@link !builders.withAllInputs | `builders.withAllInputs`}, {@link !builders.withFiles | `builders.withFiles`}, and {@link !builders.withWorkspaces | `builders.withWorkspaces`}.
 *
 * When providing `--workspaces <names>`, the paths will be paths to the requested Workspaces, not individual files.
 *
 * Typically, this should be used from the helpers provided by the command handler’s {@link !HandlerExtra | `HandlerExtra`}, in which case the first argument has been scoped for you already.
 *
 * When using this function to get affected filenames, a soft threshold is provided at 100 files. This is a safeguard against overloading {@link !run | subprocess `run`} arguments. When the threshold is hit, this function will swap to return the set of parent Workspace locations for the affected file lists.
 *
 * ```ts
 * export const handler: Handler = (argv, { getFilepaths, logger }) => {
 * 	const filepaths = await getFilepaths();
 * 	for (const files of filepaths) {
 * 		logger.log(files);
 * 	}
 * };
 * ```
 *
 * @see !HandlerExtra
 * @group Getter
 */
export async function getFilepaths(
	graph: Graph,
	argv: Argv,
	{ step, from, staged, through, affectedThreshold }: FileGetterOptions = {},
) {
	return stepWrapper({ step, name: 'Get filepaths from inputs' }, async (step) => {
		step.debug(argv);

		const paths: Array<string> = [];
		const workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			return ['.'];
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(() => `\`files\` requested: \n • ${argv.files!.join('\n • ')}`);
			paths.push(...argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(() => `\`workspaces\` requested: \n • ${argv.workspaces!.join('\n • ')}`);
			workspaces.push(...(graph.getAllByName(argv.workspaces) ?? Object.values(graph.workspaces)));
			paths.push(...workspaces.map((workspace) => path.relative(graph.root.location, workspace.location)));
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				let opts: Parameters<typeof getModifiedFiles>[0];
				if (staged || argv.staged) {
					opts = { staged: true };
				} else {
					opts = {
						from: argv['from-ref'] ?? from,
						through: argv['through-ref'] ?? through,
					};
				}

				const threshold = affectedThreshold ?? 100;
				const files = await getModifiedFiles(opts, { step });
				if (threshold === 0 || files.length < threshold) {
					paths.push(...files);
				} else {
					const workspaces = graph.getAllByLocation(files.map((f) => graph.root.resolve(f)));
					if (workspaces.includes(graph.root)) {
						return ['.'];
					}
					paths.push(...workspaces.map((ws) => graph.root.relative(ws.location)));
				}
			} else {
				step.log('`affected` requested from workspaces');
				const affected = await graph.affected(argv.workspaces!);
				paths.push(...affected.map((ws) => ws.location));
			}
		}

		return paths;
	});
}
