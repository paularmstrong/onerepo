import path from 'node:path';
import minimatch from 'minimatch';
import type { Graph, Workspace } from '@onerepo/graph';
import { stepWrapper } from '@onerepo/logger';
import { getModifiedFiles } from '@onerepo/git';
import type { LogStep } from '@onerepo/logger';

/**
 * @group Getter
 */
export interface GetterOptions {
	/**
	 * Git ref to calculate changes _exclusively_ _since_.
	 */
	from?: string;
	/**
	 * List of files to not take into account when getting the list of files, workspaces, and affected.
	 */
	ignore?: Array<string>;
	/**
	 * Git ref to calculate changes _inclusively_ _through_.
	 */
	through?: string;
	/**
	 * Optional logger step to avoid creating a new
	 */
	step?: LogStep;
}

/**
 * @group Getter
 */
export type Argv = {
	/**
	 * Whether to get the list of affected workspaces based on the other inputs of `all`, `files`, or `workspaces`
	 */
	affected?: boolean;
	/**
	 * Include _all_ workspaces or filepaths.
	 */
	all?: boolean;
	/**
	 * A list of files to calculate the affected workspaces, or filepaths.
	 */
	files?: Array<string>;
	/**
	 * A list of workspaces to calculate the affected workspaces or filepaths.
	 */
	workspaces?: Array<string>;
};

/**
 * Get a list of the affected workspaces.
 *
 * Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.
 *
 * If the root workspace is included in the list, all workspaces will be presumed affected and returned.
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
export function affected(graph: Graph, { from, ignore, through, step }: GetterOptions = {}) {
	return stepWrapper({ step, name: 'Get affected workspaces' }, async (step) => {
		const { added, modified, deleted, moved } = await getModifiedFiles(from, through, { step });
		const all = [...added, ...modified, ...deleted, ...moved];
		const files =
			ignore && ignore.length ? all.filter((file) => !ignore.some((ignore) => minimatch(file, ignore))) : all;
		step.debug(`Modified files not ignored:\n${JSON.stringify(ignore)}\n ??? ${files.join('\n ??? ')}`);
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
		 * Return all workspaces if the root is included
		 */
		if (workspaces.has(graph.root.name)) {
			step.log('Root workspace included in affected list. Assuming all workspaces.');
			return graph.workspaces;
		}

		return await graph.affected(Array.from(workspaces));
	});
}

/**
 * Get a list of workspaces based on the input arguments made available with the builders [`withAffected`](#withaffected), [`withAllInputs`](#withallinputs), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces).
 *
 * Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.
 *
 * If the root workspace is included in the list, all workspaces will be presumed affected and returned.
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
export async function workspaces(
	graph: Graph,
	argv: Argv,
	{ step, from, through, ...opts }: GetterOptions = {}
): Promise<Array<Workspace>> {
	return stepWrapper({ step, name: 'Get workspaces from inputs' }, async (step) => {
		let workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			workspaces = graph.workspaces;
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(`\`files\` requested: \n ??? ${argv.files.join('\n ??? ')}`);
			workspaces = graph.getAllByLocation(argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(`\`workspaces\` requested: \n ??? ${argv.workspaces.join('\n ??? ')}`);
			workspaces = graph.getAllByName(argv.workspaces);
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				step.log(`\`affected\` requested`);
				workspaces = await affected(graph, {
					...opts,
					from: 'from-ref' in argv ? (argv['from-ref'] as string) : from,
					through: 'through-ref' in argv ? (argv['through-ref'] as string) : through,
					step,
				});
			} else {
				const names = workspaces.map((ws) => ws.name);
				step.log(`\`affected\` requested from ??? ${names.join('\n ??? ')}`);
				workspaces = await graph.affected(names);
			}
		}

		/**
		 * Return all workspaces if the root is included
		 */
		if (workspaces.includes(graph.root)) {
			step.log('Root workspace included in requested list. Assuming all workspaces.');
			return graph.workspaces;
		}

		return workspaces;
	});
}

/**
 * Get a list of filepaths based on the input arguments made available with the builders [`withAffected`](#withaffected), [`withAllInputs`](#withallinputs), [`withFiles`](#withfiles), and [`withWorkspaces`](#withworkspaces).
 *
 * When providing `--workspaces <names>`, the paths will be paths to the requested workspaces, not individual files.
 *
 * Typically, this should be used from the helpers provided by the command [`Handler`](#handler), in which case the first argument has been scoped for you already.
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
 * @group Getter
 */
export async function filepaths(graph: Graph, argv: Argv, { step, from, through }: GetterOptions = {}) {
	return stepWrapper({ step, name: 'Get filepaths from inputs' }, async (step) => {
		const paths: Array<string> = [];
		const workspaces: Array<Workspace> = [];
		if ('all' in argv && argv.all) {
			step.log('`all` requested');
			return ['.'];
		} else if ('files' in argv && Array.isArray(argv.files)) {
			step.log(`\`files\` requested: \n ??? ${argv.files.join('\n ??? ')}`);
			paths.push(...argv.files);
		} else if ('workspaces' in argv && Array.isArray(argv.workspaces)) {
			step.log(`\`workspaces\` requested: \n ??? ${argv.workspaces.join('\n ??? ')}`);
			workspaces.push(...(graph.getAllByName(argv.workspaces) ?? Object.values(graph.workspaces)));
			paths.push(...workspaces.map((workspace) => path.relative(graph.root.location, workspace.location)));
		}

		if ('affected' in argv && argv.affected) {
			if (!workspaces.length) {
				const files = await getModifiedFiles(
					'from-ref' in argv ? (argv['from-ref'] as string) : from,
					'through-ref' in argv ? (argv['through-ref'] as string) : through,
					{ step }
				);
				const toCheck = [...files.added, ...files.modified];
				paths.push(...toCheck);
			} else {
				step.log('`affected` requested from workspaces');
				const affected = await graph.affected(argv.workspaces!);
				paths.push(...affected.map((ws) => ws.location));
			}
		}

		return paths;
	});
}
